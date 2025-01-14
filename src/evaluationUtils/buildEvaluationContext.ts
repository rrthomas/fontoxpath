import domBackedDocumentWriter from '../documentWriter/domBackedDocumentWriter';
import IDocumentWriter from '../documentWriter/IDocumentWriter';
import wrapExternalDocumentWriter from '../documentWriter/wrapExternalDocumentWriter';
import DomFacade from '../domFacade/DomFacade';
import ExternalDomFacade from '../domFacade/ExternalDomFacade';
import IDomFacade from '../domFacade/IDomFacade';
import { EvaluableExpression } from '../evaluateXPath';
import { adaptJavaScriptValueToSequence } from '../expressions/adaptJavaScriptValueToXPathValue';
import ISequence from '../expressions/dataTypes/ISequence';
import sequenceFactory from '../expressions/dataTypes/sequenceFactory';
import DynamicContext from '../expressions/DynamicContext';
import ExecutionParameters from '../expressions/ExecutionParameters';
import Expression from '../expressions/Expression';
import builtInFunctions from '../expressions/functions/builtInFunctions';
import { registerFunction } from '../expressions/functions/functionRegistry';
import { BUILT_IN_NAMESPACE_URIS } from '../expressions/staticallyKnownNamespaces';
import DomBackedNodesFactory from '../nodesFactory/DomBackedNodesFactory';
import INodesFactory from '../nodesFactory/INodesFactory';
import wrapExternalNodesFactory from '../nodesFactory/wrapExternalNodesFactory';
import staticallyCompileXPath from '../parsing/staticallyCompileXPath';
import {
	IS_XPATH_VALUE_SYMBOL,
	TypedExternalValue,
	UntypedExternalValue,
} from '../types/createTypedValueFactory';
import { LexicalQualifiedName, Options, ResolvedQualifiedName } from '../types/Options';

const generateGlobalVariableBindingName = (variableName: string) => `Q{}${variableName}[0]`;

// bootstrap builtin functions
builtInFunctions.forEach((builtInFunction) => {
	registerFunction(
		builtInFunction.namespaceURI,
		builtInFunction.localName,
		builtInFunction.argumentTypes,
		builtInFunction.returnType,
		builtInFunction.callFunction
	);
});

export function createDefaultNamespaceResolver(contextItem: any): (s: string) => string {
	if (!contextItem || typeof contextItem !== 'object' || !('lookupNamespaceURI' in contextItem)) {
		return (_prefix) => null;
	}
	return (prefix) => contextItem['lookupNamespaceURI'](prefix || null);
}

export function createDefaultFunctionNameResolver(defaultFunctionNamespaceURI: string) {
	return (
		{ prefix, localName }: LexicalQualifiedName,
		_arity: number
	): ResolvedQualifiedName | null => {
		if (!prefix) {
			return {
				namespaceURI: defaultFunctionNamespaceURI,
				localName,
			};
		}
		return null;
	};
}

export default function buildEvaluationContext(
	expression: EvaluableExpression,
	contextItem: TypedExternalValue | UntypedExternalValue,
	domFacade: IDomFacade | null,
	variables: { [s: string]: TypedExternalValue | UntypedExternalValue },
	externalOptions: Options,
	compilationOptions: {
		allowUpdating: boolean;
		allowXQuery: boolean;
		debug: boolean;
		disableCache: boolean;
	}
): {
	dynamicContext: DynamicContext;
	executionParameters: ExecutionParameters;
	expression: Expression;
} {
	if (variables === null || variables === undefined) {
		variables = variables || {};
	}
	let internalOptions: Options;
	if (externalOptions) {
		internalOptions = {
			// tslint:disable-next-line:no-console
			logger: externalOptions['logger'] || { trace: console.log.bind(console) },
			documentWriter: externalOptions['documentWriter'],
			moduleImports: externalOptions['moduleImports'],
			namespaceResolver: externalOptions['namespaceResolver'],
			functionNameResolver: externalOptions['functionNameResolver'],
			nodesFactory: externalOptions['nodesFactory'],
			xmlSerializer: externalOptions['xmlSerializer'],
		};
	} else {
		internalOptions = {
			// tslint:disable-next-line:no-console
			logger: { trace: console.log.bind(console) },
			moduleImports: {},
			namespaceResolver: null,
			nodesFactory: null,
			documentWriter: null,
			xmlSerializer: null,
		};
	}
	const wrappedDomFacade: DomFacade = new DomFacade(
		domFacade === null ? new ExternalDomFacade() : domFacade
	);

	const moduleImports = internalOptions.moduleImports || Object.create(null);

	const namespaceResolver =
		internalOptions.namespaceResolver || createDefaultNamespaceResolver(contextItem);

	const defaultFunctionNamespaceURI =
		externalOptions['defaultFunctionNamespaceURI'] === undefined
			? BUILT_IN_NAMESPACE_URIS.FUNCTIONS_NAMESPACE_URI
			: externalOptions['defaultFunctionNamespaceURI'];

	const functionNameResolver =
		internalOptions.functionNameResolver ||
		createDefaultFunctionNameResolver(defaultFunctionNamespaceURI);

	const expressionAndStaticContext = staticallyCompileXPath(
		expression,
		compilationOptions,
		namespaceResolver,
		variables,
		moduleImports,
		defaultFunctionNamespaceURI,
		functionNameResolver
	);

	const contextSequence = contextItem
		? adaptJavaScriptValueToSequence(wrappedDomFacade, contextItem)
		: sequenceFactory.empty();

	const nodesFactory: INodesFactory =
		!internalOptions.nodesFactory && compilationOptions.allowXQuery
			? new DomBackedNodesFactory(contextItem)
			: wrapExternalNodesFactory(internalOptions.nodesFactory);

	const documentWriter: IDocumentWriter = internalOptions.documentWriter
		? wrapExternalDocumentWriter(internalOptions.documentWriter)
		: domBackedDocumentWriter;

	const xmlSerializer: XMLSerializer = internalOptions.xmlSerializer;

	const variableBindings: { [s: string]: () => ISequence } = Object.keys(variables).reduce(
		(typedVariableByName, variableName) => {
			const variable = variables[variableName];
			if (variable && typeof variable === 'object' && IS_XPATH_VALUE_SYMBOL in variable) {
				// If this symbol is present, the value has already undergone type conversion.
				const castedObject = variable as TypedExternalValue;
				typedVariableByName[generateGlobalVariableBindingName(variableName)] = () => {
					return sequenceFactory.create(castedObject.convertedValue);
				};
			} else {
				typedVariableByName[generateGlobalVariableBindingName(variableName)] = () => {
					// The value is not converted yet. Do it just in time.
					return adaptJavaScriptValueToSequence(
						wrappedDomFacade,
						variables[variableName]
					);
				};
			}
			return typedVariableByName;
		},
		Object.create(null) as { [s: string]: () => ISequence }
	);

	let dynamicContext: DynamicContext;
	for (const binding of expressionAndStaticContext.staticContext.getVariableBindings()) {
		if (!variableBindings[binding]) {
			variableBindings[binding] = () =>
				expressionAndStaticContext.staticContext.getVariableDeclaration(binding)(
					dynamicContext,
					executionParameters
				);
		}
	}

	dynamicContext = new DynamicContext({
		contextItem: contextSequence.first(),
		contextItemIndex: 0,
		contextSequence,
		variableBindings,
	});

	const executionParameters = new ExecutionParameters(
		compilationOptions.debug,
		compilationOptions.disableCache,
		wrappedDomFacade,
		nodesFactory,
		documentWriter,
		externalOptions['currentContext'],
		new Map(),
		internalOptions.logger,
		xmlSerializer
	);

	return {
		dynamicContext,
		executionParameters,
		expression: expressionAndStaticContext.expression,
	};
}
