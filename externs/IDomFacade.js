/**
* @fileoverview
* @externs
*/

/**
 * @interface
 */
function IDomFacade () {
}

/**
 * @export
 * @param   {!Node}  _node
 * @return  {?Node}
 */
IDomFacade.prototype.getParentNode = function (_node) {
};

/**
 * @export
 * @param   {!Node}  _node
 * @return  {?Node}
 */
IDomFacade.prototype.getFirstChild = function (_node) {
};

/**
 * @export
 * @param   {!Node}  _node
 * @return  {?Node}
 */
IDomFacade.prototype.getLastChild = function (_node) {
};

/**
 * @export
 * @param   {!Node}  _node
 * @return  {?Node}
 */
IDomFacade.prototype.getNextSibling = function (_node) {
};

/**
 * @export
 * @param   {!Node}  _node
 * @return  {?Node}
 */
IDomFacade.prototype.getPreviousSibling = function (_node) {
};

/**
 * @export
 * @param   {!Node}  _node
 * @return  {!Array<!Node>}
 */
IDomFacade.prototype.getChildNodes = function (_node) {
};

/**
 * @export
 * @param   {!Node}    _node
 * @param   {string}  _attributeName
 * @return  {?string}
 */
IDomFacade.prototype.getAttribute = function (_node, _attributeName) {
};

/**
 * @export
 * @param   {!Node}    _node
 * @return  {!Array<{name:!string,value:!string}>}
 */
IDomFacade.prototype.getAllAttributes = function (_node) {
};

/**
 * @export
 * @param   {!Node}    _node
 * @return  {string}
 */
IDomFacade.prototype.getData = function (_node) {
};

/**
 * @export
 * @param   {!Node}                                    _node
 * @param   {function(Node, IDomFacade):!Array<Node>}  _callback
 * @return  {!Array<Node>}
 */
IDomFacade.prototype.getRelatedNodes = function (_node, _callback) {
};
