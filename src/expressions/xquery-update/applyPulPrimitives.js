const ELEMENT_NODE = 1, ATTRIBUTE_NODE = 2, TEXT_NODE = 3, PROCESSING_INSTRUCTION_NODE = 7, COMMENT_NODE = 8;

/**
 * Replaces the existing children of the element node $target by the optional text node $text. The attributes of $target are not affected.
 *
 * @param  {!Node}              target          The target to replace.
 * @param  {?Node}              text            The replacement.
 * @param  {?IDomFacade=}       domFacade       The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  {?IDocumentWriter=}  documentWriter  The documentWriter for writing changes.
 */
export const replaceElementContent = function (target, text, domFacade, documentWriter) {
	domFacade.getChildNodes(target).forEach(child => documentWriter.removeChild(target, child));
	if (text) {
		documentWriter.insertBefore(target, text, null);
	}
};

/**
 * Replaces $target with $replacement.
 *
 * @param  {!Node}              target          The target to replace.
 * @param  {!Array<!Node>}      replacement     The replacement.
 * @param  {?IDomFacade=}       domFacade       The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  {?IDocumentWriter=}  documentWriter  The documentWriter for writing changes.
 */
export const replaceNode = function (target, replacement, domFacade, documentWriter) {
	const parent = (/** @type {!Node} */ (domFacade.getParentNode(target)));
	if (!parent) {
		// We only have to change the parent property.
		return;
	}

	if (target.nodeType === ATTRIBUTE_NODE) {
		// All replacement must consist of attribute nodes.
		if (replacement.some(candidate => candidate.nodeType !== ATTRIBUTE_NODE)) {
			throw new Error('Constraint "If $target is an attribute node, $replacement must consist of zero or more attribute nodes." failed.');
		}

		documentWriter.removeAttributeNS(parent, target.namespaceURI, target.name);
		replacement.forEach(attr => {
			documentWriter.setAttributeNS(parent, attr.namespaceURI, attr.name, attr.value);
		});
	}

	if (target.nodeType === ELEMENT_NODE ||
		target.nodeType === TEXT_NODE ||
		target.nodeType === COMMENT_NODE ||
		target.nodeType === PROCESSING_INSTRUCTION_NODE) {
		const following = domFacade.getNextSibling(target);
		documentWriter.removeChild(parent, target);
		replacement.forEach(newNode => {
			documentWriter.insertBefore(parent, newNode, following);
		});
	}
};

/**
 * Replaces the string value of $target with $string-value.
 *
 * @param  {!Node}              target          The target to replace.
 * @param  {!string}            stringValue     The replacement.
 * @param  {?IDomFacade=}       domFacade       The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  {?IDocumentWriter=}  documentWriter  The documentWriter for writing changes.
 */
export const replaceValue = function (target, stringValue, domFacade, documentWriter) {
	if (target.nodeType === ATTRIBUTE_NODE) {
		const element = domFacade.getParentNode(target);
		if (element) {
			documentWriter.setAttributeNS(element, target.namespaceURI, target.name, stringValue);
		}
	} else {
		documentWriter.setData(target, stringValue);
	}
};