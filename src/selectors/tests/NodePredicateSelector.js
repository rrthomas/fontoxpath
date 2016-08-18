define([
	'../dataTypes/Sequence',
	'../dataTypes/BooleanValue',
	'../Selector',
	'../Specificity'
], function (
	Sequence,
	BooleanValue,
	Selector,
	Specificity
	) {
	'use strict';

	/**
	 * @param  {Function}  isMatchingNode  called with node and blueprint
	 */
	function NodePredicateSelector (isMatchingNode) {
		Selector.call(this, new Specificity({external: 1}));

		this._isMatchingNode = isMatchingNode;
	}

	NodePredicateSelector.prototype = Object.create(Selector.prototype);
	NodePredicateSelector.prototype.constructor = NodePredicateSelector;

	/**
	 * @param  {Node}       node
	 * @param  {Blueprint}  blueprint
	 */
	NodePredicateSelector.prototype.matches = function (node, blueprint) {
		return this._isMatchingNode.call(undefined, node, blueprint);
	};

	NodePredicateSelector.prototype.evaluate = function (dynamicContext) {
		var sequence = dynamicContext.contextItem,
			blueprint = dynamicContext.blueprint;
		// TODO: non-singleton nodeTests
		return Sequence.singleton(new BooleanValue(this.matches(sequence.value[0], blueprint)));
	};

	NodePredicateSelector.prototype.equals = function (otherSelector) {
		if (this === otherSelector) {
			return true;
		}

		return otherSelector instanceof NodePredicateSelector &&
			// Not perfect, but function logically compare cannot be done
			this._isMatchingNode === otherSelector.isMatchingNode;
	};

	return NodePredicateSelector;
});
