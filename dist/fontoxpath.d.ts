/// <reference lib="dom" />

/**
 * @public
 */
declare type Attr_2 = Node_2 & {
    localName: string;
    name: string;
    namespaceURI: string | null;
    nodeName: string;
    prefix: string | null;
    value: string;
};
export { Attr_2 as Attr }

/**
 * Buckets are an optimization to XPaths. They are passed whenever FontoXPath can determine that only
 * certain types of nodes will be used.
 *
 * For example, when evaluating the `child::element()` XPath, the `domFacade#getChildNodes` method will
 * be called with a `type-1` bucket. Signaling text nodes or comments do not have to be returned.
 *
 * @see getBucketsForNode
 * @see getBucketForSelector
 *
 * @public
 */
export declare type Bucket = 'type-1' | 'type-2' | 'type-3' | 'type-4' | 'type-7' | 'type-8' | 'type-9' | 'type-10' | 'type-11' | `name-${string}` | 'name' | 'type-1-or-type-2' | 'empty';

/**
 * @public
 */
declare type CDATASection_2 = CharacterData_2;
export { CDATASection_2 as CDATASection }

/**
 * @public
 */
declare type CharacterData_2 = Node_2 & {
    data: string;
};
export { CharacterData_2 as CharacterData }

/**
 * @public
 */
declare type Comment_2 = CharacterData_2;
export { Comment_2 as Comment }

/**
 * Compare the specificity of two XPath expressions. This function will return -1 if the second XPath is more specific, 1 if the first one is more specific and 0 if they are equal in specificity.
 *
 * @public
 *
 * @example
 * compareSpecificity('self::a', 'self::a[\@b]') === -1;
 * compareSpecificity('self::a', 'self::a and child::b') === -1;
 * compareSpecificity('self::*', 'self::a') === 1;
 * compareSpecificity('self::a', 'self::a') === 0;
 *
 * @param xpathExpressionA - The first XPath to compare
 * @param xpathExpressionB - The XPath to compare to
 *
 * @returns Either 1, 0, or -1
 */
export declare function compareSpecificity(xpathExpressionA: EvaluableExpression, xpathExpressionB: EvaluableExpression): -1 | 0 | 1;

/**
 * The (compiled) result of what {@link compileXPathToJavaScript} generated.
 *
 * @beta
 */
export declare type CompiledXPathFunction<TNode extends Node_2 = Node_2, TReturnType extends ReturnType_2 = ReturnType_2.ANY> = () => (contextItem: unknown, domFacade: unknown, runtimeLib: unknown) => IReturnTypes<TNode>[TReturnType];

/**
 * Compile a given query to JavaScript code. For executing compiled code, see
 * {@link executeJavaScriptCompiledXPath}.
 *
 * @beta
 *
 * @param selector - The selector to compile. @param returnType - One of the return types indicating the value to be returned when executing the query.
 * @param returnType - Type compiled code should return.
 * @param options - Extra options for compiling this XPath.
 *
 * @returns A string JavaScript code representing the given selector.
 */
export declare function compileXPathToJavaScript(selector: EvaluableExpression, returnType?: ReturnType_2, options?: Options | null): JavaScriptCompiledXPathResult;

/**
 * Creates a factory to convert values into a specific type.
 *
 * @public
 */
export declare const createTypedValueFactory: ExternalTypedValueFactory;

/**
 * @public
 */
declare type Document_2 = Node_2 & {
    implementation: {
        createDocument(namespaceURI: null, qualifiedNameStr: null, documentType: null): Document_2;
    };
    createAttributeNS(namespaceURI: string, name: string): Attr_2;
    createCDATASection(contents: string): CDATASection_2;
    createComment(data: string): Comment_2;
    createElementNS(namespaceURI: string, qualifiedName: string): Element_2;
    createProcessingInstruction(target: string, data: string): ProcessingInstruction_2;
    createTextNode(data: string): Text_2;
};
export { Document_2 as Document }

/**
 * @public
 */
export declare const domFacade: IDomFacade;

/**
 * @public
 */
declare type Element_2 = Node_2 & {
    localName: string;
    namespaceURI: string | null;
    nodeName: string;
    prefix: string | null;
};
export { Element_2 as Element }

/**
 * An XQuery or XPath Expression that can be evaluated. Commonly a string like `descendant::p` or
 * `ancestor::div[@class="my-class"]`. This can also be an element that represents the root of an
 * [XQueryX](https://www.w3.org/TR/xqueryx-31/) DOM tree. These XQueryX elements can be acquired
 * using the {@link parseScript} function or they can be built by hand
 *
 * @see parseScript
 *
 * @public
 */
export declare type EvaluableExpression = string | Element_2;

/**
 * Evaluates an XPath on the given contextItem. Returns the string result as if the XPath is wrapped in string(...).
 *
 * @public
 *
 * @param updateScript - The update script to execute. Supports XPath 3.1.
 * @param contextItem  - The node from which to run the XPath.
 * @param domFacade    - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param variables    - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param options      - Extra options for evaluating this XPath.
 *
 * @returns The query result and pending update list.
 */
export declare function evaluateUpdatingExpression(updateScript: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: UpdatingOptions | null): Promise<{
    pendingUpdateList: object[];
    xdmValue: any[];
}>;

/**
 * Evaluates an update script to a pending update list. See
 * [XQUF](https://www.w3.org/TR/xquery-update-30/) for more information on XQuery Update Facility.
 *
 * @public
 *
 * @param updateScript - The update script to execute. Supports XPath 3.1.
 * @param contextItem  - The node from which to run the XPath.
 * @param domFacade    - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param variables    - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param options      - Extra options for evaluating this XPath.
 *
 * @returns The query result and pending update list.
 */
export declare function evaluateUpdatingExpressionSync<TNode extends Node_2, TReturnType extends ReturnType_2>(updateScript: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: UpdatingOptions | null): {
    pendingUpdateList: object[];
    xdmValue: IReturnTypes<TNode>[TReturnType];
};

/**
 * @public
 */
export declare type EvaluateXPath = {
    /**
     * Evaluates an XPath on the given contextItem.
     *
     * If the return type is ANY_TYPE, the returned value depends on the result of the XPath:
     *  * If the XPath evaluates to the empty sequence, an empty array is returned.
     *  * If the XPath evaluates to a singleton node, that node is returned.
     *  * If the XPath evaluates to a singleton value, that value is atomized and returned.
     *  * If the XPath evaluates to a sequence of nodes, those nodes are returned.
     *  * Else, the sequence is atomized and returned.
     *
     * @public
     *
     * @param  selector    - The selector to execute. Supports XPath 3.1.
     * @param  contextItem - The node from which to run the XPath.
     * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
     * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
     * @param  returnType  - One of the return types, indicates the expected type of the XPath query.
     * @param  options     - Extra options for evaluating this XPath
     *
     * @returns The result of executing this XPath
     */
    <TNode extends Node_2, TReturnType extends ReturnType_2>(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
        [s: string]: any;
    } | null, returnType?: TReturnType, options?: Options | null): IReturnTypes<TNode>[TReturnType];
    /**
     * Returns the result of the query, can be anything depending on the
     * query. Note that the return type is determined dynamically, not
     * statically: XPaths returning empty sequences will return empty
     * arrays and not null, like one might expect.
     */
    ANY_TYPE: ReturnType_2.ANY;
    ARRAY_TYPE: ReturnType_2.ARRAY;
    ASYNC_ITERATOR_TYPE: ReturnType_2.ASYNC_ITERATOR;
    /**
     * Resolves to true or false, uses the effective boolean value to
     * determine the result. count(1) resolves to true, count(())
     * resolves to false
     */
    BOOLEAN_TYPE: ReturnType_2.BOOLEAN;
    /**
     * Resolves to the first node.NODES_TYPE would have resolved to.
     */
    FIRST_NODE_TYPE: ReturnType_2.FIRST_NODE;
    /**
     * Resolve to an object, as a map
     */
    MAP_TYPE: ReturnType_2.MAP;
    /**
     * Resolve to all nodes the XPath resolves to. Returns nodes in the
     * order the XPath would. Meaning (//a, //b) resolves to all A nodes,
     * followed by all B nodes. //*[self::a or self::b] resolves to A and
     * B nodes in document order.
     */
    NODES_TYPE: ReturnType_2.NODES;
    /**
     * Resolve to a number, like count((1,2,3)) resolves to 3.
     */
    NUMBER_TYPE: ReturnType_2.NUMBER;
    /**
     * Resolve to an array of numbers
     */
    NUMBERS_TYPE: ReturnType_2.NUMBERS;
    /**
     * Resolve to a string, like //someElement[1] resolves to the text
     * content of the first someElement
     */
    STRING_TYPE: ReturnType_2.STRING;
    /**
     * Resolve to an array of strings
     */
    STRINGS_TYPE: ReturnType_2.STRINGS;
    /**
     * Can be used to signal an XPath program should executed
     */
    XPATH_3_1_LANGUAGE: Language.XPATH_3_1_LANGUAGE;
    /**
     * Can be used to signal an XQuery program should be executed instead
     * of an XPath
     */
    XQUERY_3_1_LANGUAGE: Language.XQUERY_3_1_LANGUAGE;
    /**
     * Can be used to signal Update facility can be used.
     *
     * To catch pending updates, use {@link evaluateUpdatingExpression}
     */
    XQUERY_UPDATE_3_1_LANGUAGE: Language.XQUERY_UPDATE_3_1_LANGUAGE;
};

export declare const evaluateXPath: EvaluateXPath;

/**
 * Evaluates an XPath on the given contextNode. Returns the result as an array, if the result is an XPath array.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The array result, as a JavaScript array with atomized values.
 */
export declare function evaluateXPathToArray(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): any[];

/**
 * Evaluates an XPath on the given contextNode. Returns the result as an async iterator
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns An async iterator to the return values.
 */
export declare function evaluateXPathToAsyncIterator(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): AsyncIterableIterator<any>;

/**
 * Evaluates an XPath on the given contextNode.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns A boolean result
 */
export declare function evaluateXPathToBoolean(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): boolean;

/**
 * Evaluates an XPath on the given contextNode. Returns the first node result.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The first matching node, in the order defined by the XPath.
 */
export declare function evaluateXPathToFirstNode<T extends Node_2>(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): T | null;

/**
 * Evaluates an XPath on the given contextNode. Returns the result as a map, if the result is an XPath map.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The map result, as an object. Because of JavaScript
 * constraints, key 1 and '1' are the same. The values in this map are
 * the JavaScript simple types. See evaluateXPath for more details in
 * mapping types.
 */
export declare function evaluateXPathToMap(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): {
    [s: string]: any;
};

/**
 * Evaluates an XPath on the given contextNode. Returns all nodes the XPath resolves to.
 * Returns result in the order defined in the XPath. The path operator ('/'), the union operator ('union' and '|') will sort.
 * This implies (//A, //B) resolves to all A nodes, followed by all B nodes, both in document order, but not merged.
 * However: (//A | //B) resolves to all A and B nodes in document order.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns All matching Nodes, in the order defined by the XPath.
 */
export declare function evaluateXPathToNodes<T extends Node_2>(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): T[];

/**
 * Evaluates an XPath on the given contextNode. Returns the numeric result.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The numerical result.
 */
export declare function evaluateXPathToNumber(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): number;

/**
 * Evaluates an XPath on the given contextNode. Returns the numeric result.
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The numerical results.
 */
export declare function evaluateXPathToNumbers(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): number[];

/**
 * Evaluates an XPath on the given contextNode. Returns the string result as if the XPath is wrapped in string(...).
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The string result.
 */
export declare function evaluateXPathToString(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): string;

/**
 * Evaluates an XPath on the given contextNode. Returns the string result as if the XPath is wrapped in string(...).
 *
 * @public
 *
 * @param  selector    - The selector to execute. Supports XPath 3.1.
 * @param  contextItem - The node from which to run the XPath.
 * @param  domFacade   - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  variables   - Extra variables (name to value). Values can be number, string, boolean, nodes or object literals and arrays.
 * @param  options     - Extra options for evaluating this XPath.
 *
 * @returns The string result.
 */
export declare function evaluateXPathToStrings(selector: EvaluableExpression, contextItem?: any | null, domFacade?: IDomFacade | null, variables?: {
    [s: string]: any;
} | null, options?: Options | null): string[];

/**
 * Execute XPath compiled to JavaScript that is evaluated to a function. For
 * compiling XPath to JavaScript, see {@link compileXPathToJavaScript}.
 *
 * @beta
 *
 * @param compiledXPathFunction - A function containing compiled XPath in
 * its body.
 * @param contextItem - The node from which to run the XPath.
 * @param domFacade - The domFacade (or DomFacade like interface) for retrieving relation.
 *
 * @returns The result of executing this XPath.
 */
export declare const executeJavaScriptCompiledXPath: <TNode extends Node_2, TReturnType extends ReturnType_2>(compiledXPathFunction: CompiledXPathFunction<TNode, TReturnType>, contextItem?: any | null, domFacade?: IDomFacade | null) => IReturnTypes<TNode>[TReturnType];

/**
 * @public
 *
 * @param  pendingUpdateList - The updateScript to execute.
 * @param  domFacade         - The domFacade (or DomFacade like interface) for retrieving relations.
 * @param  nodesFactory      - The nodesFactory for creating nodes.
 * @param  documentWriter    - The documentWriter for writing changes.
 */
export declare function executePendingUpdateList(pendingUpdateList: object[], domFacade?: IDomFacade, nodesFactory?: INodesFactory, documentWriter?: IDocumentWriter): void;

/**
 * Creates a factory to convert values into a specific type.
 *
 * @param type - The type into which to convert the values.
 *
 * @public
 */
export declare type ExternalTypedValueFactory = (type: string) => (value: ValidValueSequence, domFacade: IDomFacade) => unknown;

/**
 * Resolves a function name to its resolved QName form
 *
 * @public
 */
export declare type FunctionNameResolver = (qname: LexicalQualifiedName, arity: number) => ResolvedQualifiedName;

/**
 * @public
 * @param xpathExpression - The XPath for which a bucket should be retrieved
 */
export declare function getBucketForSelector(xpathExpression: EvaluableExpression): Bucket;

/**
 * Get the buckets that apply to a given node.
 *
 * Buckets can be used to pre-filter XPath expressions to exclude those that will never match the given node.
 *
 * The bucket for a selector can be retrieved using {@link getBucketForSelector}.
 *
 * @public
 *
 * @param node - The node which buckets should be retrieved
 */
export declare function getBucketsForNode(node: Node_2): Bucket[];

/**
 * Successfully JavaScript compiled XPath.
 * @beta
 */
export declare interface IAstAccepted {
    code: string;
    isAstAccepted: true;
}

/**
 * Result for failing to compile XPath to JavaScript.
 * @beta
 */
export declare interface IAstRejected {
    isAstAccepted: false;
    reason: string;
}

/**
 * @public
 */
export declare interface IDocumentWriter {
    insertBefore(parent: Element_2 | Document_2, newNode: Node_2, referenceNode: Node_2 | null): void;
    removeAttributeNS(node: Element_2, namespace: string, name: string): void;
    removeChild(parent: Element_2 | Document_2, child: Node_2): void;
    setAttributeNS(node: Element_2, namespace: string, name: string, value: string): void;
    setData(node: Node_2, data: string): void;
}

/**
 * The base interface of a dom facade
 *
 * @public
 */
export declare interface IDomFacade {
    /**
     * Get all attributes of this element.
     * The bucket can be used to narrow down which attributes should be retrieved.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getAllAttributes(node: Element_2, bucket?: Bucket | null): Attr_2[];
    /**
     * Get the value of specified attribute of this element.
     *
     * @param  node -
     * @param  attributeName -
     */
    getAttribute(node: Element_2, attributeName: string): string | null;
    /**
     * Get all child nodes of this element.
     * The bucket can be used to narrow down which child nodes should be retrieved.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getChildNodes(node: Node_2, bucket?: Bucket | null): Node_2[];
    /**
     * Get the data of this element.
     *
     * @param  node -
     */
    getData(node: Attr_2 | CharacterData_2): string;
    /**
     * Get the first child of this element.
     * An implementation of IDomFacade is free to interpret the bucket to skip returning nodes that do not match the bucket, or use this information to its advantage.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getFirstChild(node: Node_2, bucket?: Bucket | null): Node_2 | null;
    /**
     * Get the last child of this element.
     * An implementation of IDomFacade is free to interpret the bucket to skip returning nodes that do not match the bucket, or use this information to its advantage.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getLastChild(node: Node_2, bucket?: Bucket | null): Node_2 | null;
    /**
     * Get the next sibling of this node
     * An implementation of IDomFacade is free to interpret the bucket to skip returning nodes that do not match the bucket, or use this information to its advantage.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the nextSibling that is requested.
     */
    getNextSibling(node: Node_2, bucket?: Bucket | null): Node_2 | null;
    /**
     * Get the parent of this element.
     * An implementation of IDomFacade is free to interpret the bucket to skip returning nodes that do not match the bucket, or use this information to its advantage.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getParentNode(node: Node_2, bucket?: Bucket | null): Node_2 | null;
    /**
     * Get the previous sibling of this element.
     * An implementation of IDomFacade is free to interpret the bucket to skip returning nodes that do not match the bucket, or use this information to its advantage.
     *
     * @param  node -
     * @param  bucket - The bucket that matches the attribute that will be used.
     */
    getPreviousSibling(node: Node_2, bucket?: Bucket | null): Node_2 | null;
}

/**
 * Defines the factory methods used in XQuery. Basically equivalent to the Document interface, but
 * with the 'createDocument' factory method added.
 *
 * @public
 */
export declare interface INodesFactory extends ISimpleNodesFactory {
    createDocument(): Document_2;
}

/**
 * @public
 */
export declare interface IReturnTypes<T extends Node_2> {
    [ReturnType_2.ANY]: any;
    [ReturnType_2.NUMBER]: number;
    [ReturnType_2.STRING]: string;
    [ReturnType_2.BOOLEAN]: boolean;
    [ReturnType_2.NODES]: T[];
    [ReturnType_2.FIRST_NODE]: T | null;
    [ReturnType_2.STRINGS]: string[];
    [ReturnType_2.MAP]: {
        [s: string]: any;
    };
    [ReturnType_2.ARRAY]: any[];
    [ReturnType_2.NUMBERS]: number[];
    [ReturnType_2.ASYNC_ITERATOR]: AsyncIterableIterator<any>;
}

/**
 * Subset of the constructor methods present on Document. Can be used to create textnodes, elements,
 * attributes, CDataSecions, comments and processing instructions.
 *
 * @public
 */
export declare interface ISimpleNodesFactory {
    createAttributeNS(namespaceURI: string, name: string): Attr_2;
    createCDATASection(contents: string): CDATASection_2;
    createComment(contents: string): Comment_2;
    createElementNS(namespaceURI: string, name: string): Element_2;
    createProcessingInstruction(target: string, data: string): ProcessingInstruction_2;
    createTextNode(contents: string): Text_2;
}

/**
 * Result for compiling XPath to JavaScript
 * @beta
 */
export declare type JavaScriptCompiledXPathResult = IAstAccepted | IAstRejected;

/**
 * Specifies which language to use.
 *
 * @public
 */
export declare enum Language {
    'XPATH_3_1_LANGUAGE' = "XPath3.1",
    'XQUERY_3_1_LANGUAGE' = "XQuery3.1",
    'XQUERY_UPDATE_3_1_LANGUAGE' = "XQueryUpdate3.1"
}

/**
 * An unresolved qualified name. Exists of a prefix and a local name
 *
 * @public
 */
export declare type LexicalQualifiedName = {
    localName: string;
    prefix: string;
};

/**
 * @public
 */
export declare type Logger = {
    trace: (message: string) => void;
};

/**
 * Resolves a namespace prefix to its URI
 *
 * @public
 */
export declare type NamespaceResolver = (prefix: string) => string | null;

/**
 * @public
 */
declare type Node_2 = {
    nodeType: number;
};
export { Node_2 as Node }

/**
 * @public
 */
export declare type Options = {
    /**
     * Whether or not the AST should get annotated after parsing an expression. The annotation adds
     * additional type information to the AST.
     * @beta
     */
    annotateAst?: boolean;
    /**
     * The current context for a query. Will be passed whenever an extension function is called. Can be
     * used to implement the current function in XSLT.
     *
     * Undefined by default.
     *
     * @public
     */
    currentContext?: any;
    /**
     * Whether the query is ran in debug mode. Queries in debug mode output better stacktraces but
     * are slower
     *
     * @public
     */
    debug?: boolean;
    /**
     * The default function namespace uri.
     *
     * Defaults to the fn namespace ('http://www.w3.org/2005/xpath-functions').
     *
     * @public
     */
    defaultFunctionNamespaceURI?: string;
    /**
     * Disables caching the compilation result of this expression. For internal use
     *
     * @public
     */
    disableCache?: boolean;
    /**
     * A facade that can be used to intercept any methods that will change a document in XQuery
     * Update Facility when using the copy/transform syntax.
     *
     * Defaults to just changing the document.
     *
     * @public
     */
    documentWriter?: IDocumentWriter;
    /**
     * Hook that is called whenever a function name is resolved. Can be used to redirect function
     * calls to a different implementation.
     *
     * Example uses are 'joining' multiple function libraries together, like how XForms exposes
     * functions in the `fn` namespace in the `xforms-functions` namespace.
     *
     * This function uses the default function namespace uri combined with the imported modules and
     * the namespace resolver by default.
     *
     * Locally declared namespace resolving always takes precedence.
     *
     * @public
     *
     * @param qname - The lexical qualified name of the function that needs resolving
     * @param  arity - The arity of the function.
     *
     * @returns The resolved name.
     */
    functionNameResolver?: FunctionNameResolver;
    /**
     * The language to use. Can be XPath, XQuery or XQuery Update Facility.
     */
    language?: Language;
    /**
     * Called whenever the `fn:trace()` function is called. Defaults to `console#log`
     */
    logger?: Logger;
    /**
     * Log queries which didn't get completely annotated
     */
    logUnannotatedQueries?: boolean;
    /**
     * Additional modules to import. Imported modules are always statically known
     */
    moduleImports?: {
        [s: string]: string;
    };
    /**
     * How to resolve element namespaces. Defaults to returning `null`, which is the default
     * namespace uri _or_ an error when resolving a prefix.
     */
    namespaceResolver?: NamespaceResolver;
    /**
     * How to create new elements when using XQuery or XQuery Update Facility. Defaults to creating
     * elements using the document implementation related to the passed context node.
     */
    nodesFactory?: INodesFactory;
    /**
     * Serializer used for fn:serialize().
     */
    xmlSerializer?: XMLSerializer_2;
};

/**
 * Parse an XPath or XQuery script and output it as an XQueryX element. Refer to the [XQueryX
 * spec](https://www.w3.org/TR/xqueryx-31/) for more info.
 *
 * The precise generated XQueryX may change in the future when progress is made on supporting the
 * XQueryX test set provided with the [QT3 test suite](https://dev.w3.org/2011/QT3-test-suite/).
 *
 * Note that the parseScript function returns a detached element: it is not added to the passed
 * document.
 *
 * The element also contains the original expression as a comment.
 *
 * This may later be used for error processing to display the full original script instead of only referring to the AST.
 *
 * @example
 * Parse "self::element" to an XQueryX element and access it
 * ```
 * const xqueryx = parseScript(
 *   'self::element',
 *   {
 *     language: evaluateXPath.XPATH_3_1_LANGUAGE
 *   },
 *   new slimdom.Document()
 * );
 *
 * // Get the nametest element
 * const nameTestElement = evaluateXPathToFirstNode(
 *   'descendant-or-self::Q{http://www.w3.org/2005/XQueryX}nameTest',
 *   xqueryx)
 * ```
 *
 * @public
 *
 * @param script - The script to parse
 *
 * @param options - Additional options for parsing. Can be used to switch between parsing XPath or
 * XQuery update facility
 *
 * @param simpleNodesFactory - A NodesFactory will be used to create the DOM. This can be a
 * reference to the document in which the XQueryX will be created
 *
 * @param documentWriter - The documentWriter will be used to append children to the newly created
 * dom
 */
export declare function parseScript<TElement extends Element_2>(script: string, options: Options, simpleNodesFactory: ISimpleNodesFactory, documentWriter?: IDocumentWriter): TElement;

/**
 * Precompile an XPath selector asynchronously.
 *
 * @deprecated This code is deprecated. This is a no-op!
 *
 * @public
 *
 * @param   xPathString - The xPath which should be pre-compiled
 *
 * @returns  A promise which is resolved with the xpath string after compilation.
 */
export declare function precompileXPath(xPathString: string): Promise<string>;

/**
 * @public
 */
declare type ProcessingInstruction_2 = CharacterData_2 & {
    nodeName: string;
    target: string;
};
export { ProcessingInstruction_2 as ProcessingInstruction }

/**
 * Offers tooling to profile how much time is being spent running XPaths.
 *
 * Note that Javascript custom functions are also included in the profile. If they call new XPaths
 * themselves, they may overlap in measurement.
 *
 * For example, the xpath `app:custom-function("a", "b")` calls a new XPath, the total time taken for
 * that outer XPath will include the time taken for the inner one as well.
 *
 * @example
 * import \{ evaluateXPathToNodes, profiler \} from 'fontoxpath';
 * // For browsers:
 * profiler.setPerformanceImplementation(window.performance)
 * // For NodeJS:
 * profiler.setPerformanceImplementation(global.performance)
 *
 * profiler.startProfiling();
 * // Do loads of XPaths
 * profiler.stopProfiling();
 *
 * const performanceSummary = profiler.getPerformanceSummary();
 *
 * // Do whatever with this profiler result
 * console.log(`The most expensive XPath was ${performanceSummary[0].xpath}`);
 *
 * @public
 */
export declare type Profiler = {
    /**
     * Get the performance metrics of executed XPaths between the {@link Profiler.startProfiling}
     * and {@link Profiler.stopProfiling} calls.
     *
     * @returns Returns an array of {@link XPathPerformanceMeasurement} items which can be
     * coverted into a csv to paste in your favorite spreadsheet editor. Results are ordered by their total duration.
     *
     * @example
     * const summary = profiler.getPerformanceSummary();
     * const csv = summary.map(item =\>
     *     `${item.xpath},${item.times},${item.average},${item.totalDuration}`);
     * await navigator.clipboard.writeText(csv);
     *
     * @public
     *
     */
    getPerformanceSummary(): XPathPerformanceMeasurement[];
    /**
     * Set the impormentation of the Performance API object. this should implement the Performance interface.
     *
     * This is usually either window.performance (in the Browser) or global.performance (for NodeJS)
     *
     * @public
     */
    setPerformanceImplementation(performance: Performance): void;
    /**
     * Start profiling XPaths. All marks are cleared. Use {@link Profiler.stopProfiling} to stop it again.
     *
     * @public
     */
    startProfiling(): void;
    /**
     * Stop profiling XPaths, use the {@link Profiler.getPerformanceSummary} function to get hold of the
     * summarized results.
     *
     * @public
     */
    stopProfiling(): void;
};

/**
 * @public
 */
export declare const profiler: Profiler;

/**
 * Add a custom function for use in xpath-serialized expressions.
 *
 * @public
 *
 * @param  name - The name of this custom function. The string overload is deprecated, please register functions using the object overload
 * @param  signature - The signature of the function, as array of strings (e.g. ['item()', 'node()?', 'xs:numeric'])
 * @param  returnType - The return type of the function, as sequence type (e.g. 'xs:boolean()')
 * @param  callback - The function itself, which gets the dynamicContext and arguments passed
 */
export declare function registerCustomXPathFunction(name: string | {
    localName: string;
    namespaceURI: string;
}, signatureNames: string[], returnTypeName: string, callback: (domFacade: {
    currentContext: any;
    domFacade: IDomFacade;
}, ...functionArgs: any[]) => any): void;

/**
 * Register an XQuery module
 * @public
 * @param   moduleString - The string contents of the module
 * @param   options - Additional compilation options
 * @returns  The namespace uri of the new module
 */
export declare function registerXQueryModule(moduleString: string, options?: {
    debug: boolean;
}): string;

/**
 * A qualified name, consists of a localname and a namespace URI
 *
 * @public
 */
export declare type ResolvedQualifiedName = {
    localName: string;
    namespaceURI: string;
};

/**
 * @public
 */
declare enum ReturnType_2 {
    'ANY' = 0,
    'NUMBER' = 1,
    'STRING' = 2,
    'BOOLEAN' = 3,
    'NODES' = 7,
    'FIRST_NODE' = 9,
    'STRINGS' = 10,
    'MAP' = 11,
    'ARRAY' = 12,
    'NUMBERS' = 13,
    'ASYNC_ITERATOR' = 99
}
export { ReturnType_2 as ReturnType }

/**
 * @public
 */
declare type Text_2 = CharacterData_2;
export { Text_2 as Text }

/**
 * Type that contains a collection of options for the updating expression exaluation.
 *
 * @public
 *
 * annotateAst				- If the AST should be annotated.
 * debug					- Sets the debug option for the evaluation context.
 * disableCache				- Sets if the cache should or should not be disabled.
 * documentWriter			- Sets the documentwriter object
 * logger					- Sets a logger object.
 * moduleImports			- Sets all the module imports.
 * namespaceResolver		- Callback to do namespace resolving.
 * nodesFactory				- Reference to a nodes factory object.
 * returnType				- The type that the evaluation function will return.
 */
export declare type UpdatingOptions = {
    annotateAst?: boolean;
    debug?: boolean;
    disableCache?: boolean;
    documentWriter?: IDocumentWriter;
    logger?: Logger;
    moduleImports?: {
        [s: string]: string;
    };
    namespaceResolver?: (s: string) => string | null;
    nodesFactory?: INodesFactory;
    returnType?: ReturnType_2;
};

/**
 * Any type is allowed expect: functions, symbols, undefined, and null
 *
 * @public
 */
export declare type ValidValue = string | number | boolean | object | Date;

/**
 * @public
 */
export declare type ValidValueSequence = ValidValue | ValidValue[] | null;

/**
 * An XML serializer that can serialzie nodes. Used when the `fn:serialize` function is called with
 * a node
 *
 * @public
 */
declare type XMLSerializer_2 = {
    serializeToString: (root: Node_2) => string;
};
export { XMLSerializer_2 as XMLSerializer }

/**
 * Describes the performance of a single XPath across multiple evaluations.
 *
 * See {@link profiler}.
 * @public
 */
export declare type XPathPerformanceMeasurement = {
    average: number;
    times: number;
    totalDuration: number;
    xpath: string;
};

export { }
