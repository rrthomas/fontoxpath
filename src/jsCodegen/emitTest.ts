import { NODE_TYPES } from '../domFacade/ConcreteNode';
import QName from '../expressions/dataTypes/valueTypes/QName';
import { Bucket } from '../expressions/util/Bucket';
import astHelper, { IAST } from '../parsing/astHelper';
import { CodeGenContext } from './CodeGenContext';
import escapeJavaScriptString from './escapeJavaScriptString';
import {
	acceptAst,
	ContextItemIdentifier,
	GeneratedCodeBaseType,
	PartialCompilationResult,
	rejectAst,
} from './JavaScriptCompiledXPath';

const testAstNodes = {
	TEXT_TEST: 'textTest',
	ELEMENT_TEST: 'elementTest',
	NAME_TEST: 'nameTest',
	WILDCARD: 'Wildcard',
};

export const tests = Object.values(testAstNodes);

// text() matches any text node.
// https://www.w3.org/TR/xpath-31/#doc-xpath31-TextTest
function emitTextTest(
	_ast: IAST,
	identifier: ContextItemIdentifier
): [PartialCompilationResult, Bucket | null] {
	return [
		acceptAst(`${identifier}.nodeType === /*TEXT_NODE*/ ${NODE_TYPES.TEXT_NODE}`, {
			type: GeneratedCodeBaseType.Value,
		}),
		null,
	];
}

function resolveNamespaceURI(qName: QName, staticContext: CodeGenContext) {
	// Resolve prefix.
	if (qName.namespaceURI === null && qName.prefix !== '*') {
		qName.namespaceURI = staticContext.resolveNamespace(qName.prefix || '') || null;
		if (!qName.namespaceURI && qName.prefix) {
			throw new Error(`XPST0081: The prefix ${qName.prefix} could not be resolved.`);
		}
	}
}

function emitNameTestFromQName(
	identifier: ContextItemIdentifier,
	qName: QName,
	staticContext: CodeGenContext
): [PartialCompilationResult, Bucket | null] {
	const namespaceURIWasResolved = qName.namespaceURI === null;
	resolveNamespaceURI(qName, staticContext);
	const { prefix, namespaceURI, localName } = qName;

	const isElementOrAttributeCode = `${identifier}.nodeType
		&& (${identifier}.nodeType === /*ELEMENT_NODE*/ ${NODE_TYPES.ELEMENT_NODE}
		|| ${identifier}.nodeType === /*ATTRIBUTE_NODE*/ ${NODE_TYPES.ATTRIBUTE_NODE})`;

	// Simple cases.
	if (prefix === '*') {
		if (localName === '*') {
			return [
				acceptAst(isElementOrAttributeCode, { type: GeneratedCodeBaseType.Value }),
				null,
			];
		}
		return [
			acceptAst(
				`${isElementOrAttributeCode} && ${identifier}.localName === ${escapeJavaScriptString(
					localName
				)}`,
				{ type: GeneratedCodeBaseType.Value }
			),
			`name-${localName}`,
		];
	}

	// Return condition comparing localName and namespaceURI against the context
	// item.
	const matchesLocalNameCode =
		localName !== '*'
			? `${isElementOrAttributeCode} && ${identifier}.localName === ${escapeJavaScriptString(
					localName
			  )} && `
			: '';

	let resolveNamespaceURICode: string;
	if (namespaceURIWasResolved && !prefix) {
		// This prefix came from the name
		// While the namespaceuri is also present, this should not be used for _attribute_ name tests
		resolveNamespaceURICode = `${identifier}.nodeType
&& ${identifier}.nodeType === /*ELEMENT_NODE*/ ${
			NODE_TYPES.ELEMENT_NODE
		} ? ${escapeJavaScriptString(namespaceURI)} : null`;
	} else {
		// There was a prefix. This applies to elements and attributes
		resolveNamespaceURICode = escapeJavaScriptString(namespaceURI);
	}
	const matchesNamespaceCode = `(${identifier}.namespaceURI || null) === (${resolveNamespaceURICode} || null)`;

	return [
		acceptAst(`${matchesLocalNameCode}${matchesNamespaceCode}`, {
			type: GeneratedCodeBaseType.Value,
		}),
		`name-${localName}`,
	];
}

// element() and element(*) match any single element node, regardless of its name or type annotation.
// https://www.w3.org/TR/xpath-31/#doc-xpath31-ElementTest
function emitElementTest(
	ast: IAST,
	identifier: ContextItemIdentifier,
	staticContext: CodeGenContext
): [PartialCompilationResult, Bucket | null] {
	const elementName = astHelper.getFirstChild(ast, 'elementName');
	const star = elementName && astHelper.getFirstChild(elementName, 'star');
	const isElementCode = `${identifier}.nodeType === /*ELEMENT_NODE*/ ${NODE_TYPES.ELEMENT_NODE}`;

	if (elementName === null || star) {
		return [acceptAst(isElementCode, { type: GeneratedCodeBaseType.Value }), null];
	}

	const qName = astHelper.getQName(astHelper.getFirstChild(elementName, 'QName'));

	return emitNameTestFromQName(identifier, qName, staticContext);
}

// A node test that consists only of an EQName or a Wildcard is called a name test.
// https://www.w3.org/TR/xpath-31/#doc-xpath31-NameTest
function emitNameTest(ast: IAST, identifier: ContextItemIdentifier, staticContext: CodeGenContext) {
	return emitNameTestFromQName(identifier, astHelper.getQName(ast), staticContext);
}

// select all element children of the context node
// for example: child::*.
// https://www.w3.org/TR/xpath-31/#doc-xpath31-Wildcard
function emitWildcard(
	ast: IAST,
	identifier: ContextItemIdentifier,
	staticContext: CodeGenContext
): [PartialCompilationResult, Bucket | null] {
	if (!astHelper.getFirstChild(ast, 'star')) {
		return emitNameTestFromQName(
			identifier,
			{
				localName: '*',
				namespaceURI: null,
				prefix: '*',
			},
			staticContext
		);
	}

	const uri = astHelper.getFirstChild(ast, 'uri');
	if (uri) {
		return emitNameTestFromQName(
			identifier,
			{
				localName: '*',
				namespaceURI: astHelper.getTextContent(uri),
				prefix: '',
			},
			staticContext
		);
	}

	// Either the prefix or the localName are 'starred', find out which one
	const ncName = astHelper.getFirstChild(ast, 'NCName');
	if (astHelper.getFirstChild(ast, '*')[0] === 'star') {
		// The prefix is 'starred'
		return emitNameTestFromQName(
			identifier,
			{
				localName: astHelper.getTextContent(ncName),
				namespaceURI: null,
				prefix: '*',
			},
			staticContext
		);
	}

	// The localName is 'starred'
	return emitNameTestFromQName(
		identifier,
		{
			localName: '*',
			namespaceURI: null,
			prefix: astHelper.getTextContent(ncName),
		},
		staticContext
	);
}

export default function emitTest(
	ast: IAST,
	identifier: ContextItemIdentifier,
	staticContext: CodeGenContext
): [PartialCompilationResult, Bucket | null] {
	// emitTest returns a tuple of the generated code and an optional bucket.

	const test = ast[0];

	switch (test) {
		case testAstNodes.ELEMENT_TEST:
			return emitElementTest(ast, identifier, staticContext);
		case testAstNodes.TEXT_TEST:
			return emitTextTest(ast, identifier);
		case testAstNodes.NAME_TEST:
			return emitNameTest(ast, identifier, staticContext);
		case testAstNodes.WILDCARD:
			return emitWildcard(ast, identifier, staticContext);
		default:
			return [rejectAst(`Unsupported: the test '${test}'.`), null];
	}
}
