import Item from './Item';
import NodeValue from './NodeValue';
import BooleanValue from './BooleanValue';

/**
 * @constructor
 * @extends {Item<!Generator<!Item>>}
 * @param  {!Array<!Item> | !Iterator<!Item> | {next: function():!IIterableResult<!Item>}}  valueIterator
 * @param  {?number=}                       predictedLength
 */
function Sequence (valueIterator, predictedLength = null) {
	if (Array.isArray(valueIterator)) {
		return new ArrayBackedSequence(valueIterator);
	}
    Item.call(this, () => {
		let i = -1;
		return {
			[Symbol.iterator]: function () {
				return this;
			},
			next: () => {
				i++;
				if (this._length !== null && i >= this._length) {
					return { done: true };
				}

				if (this._cachedValues[i] !== undefined) {
					return { done: false, value: this._cachedValues[i] };
				}

				if (i === 0) {
					const first = this._rawIterator.next();
					if (first.done) {
						this._length = 0;
						return { done: true };
					}
					this._cachedValues[0] = first.value;
					return { done: false, value: first.value };
				}

				if (i === 1) {
					const second = this._rawIterator.next();
					if (second.done) {
						this._length = 1;
						return { done: true };
					}
					this._cachedValues[1] = second.value;
					return { done: false, value: second.value };
				}

				this._iteratorHasProgressed = true;

				const value = this._rawIterator.next();
				return value;
			}
		};
	});

	this._rawIterator = valueIterator;

	this._length = predictedLength;

	this._iteratorHasProgressed = false;

	this._cachedValues = [];
}

Sequence.prototype = Object.create(Item.prototype);

Sequence.prototype.getAllValues = function () {
	if (this._iteratorHasProgressed && this._length !== this._cachedValues.length) {
		throw new Error('Implementation error: Sequence Iterator has progressed.');
	}
	return Array.from(this.value());
};

Sequence.prototype.first = function () {
	if (this._cachedValues[0] !== undefined) {
		return this._cachedValues[0];
	}
	const value = this.value().next();
	return value.done ? null : value.value;
};

Sequence.prototype.map = function (callback) {
	let i = -1;
	/**
	 * @type {Iterable<Item>}
	 */
	const iterator = this.value();
	return new Sequence(
		{
			next: () => {
				i++;
				const value = iterator.next();
				if (value.done) {
					return value;
				}
				return {
					value: callback(value.value, i, this),
					done: false
				};
			}
		},
		this._length
	);
};

Sequence.prototype.filter = function (callback) {
	let i = -1;
	/**
	 * @type {Iterable<Item>}
	 */
	const iterator = this.value();

	return new Sequence(
		{
			next: () => {
				i++;
				let value = iterator.next();
				while (!value.done && !callback(value.value, i, this)) {
					i++;
					value = iterator.next();
				}
				return value;
			}
		});
};

/**
 * @param  {!../DynamicContext} dynamicContext
 * @return {!Sequence}
 */
Sequence.prototype.atomize = function (dynamicContext) {
    return this.map(value => value.atomize(dynamicContext));
};

Sequence.prototype.isEmpty = function () {
	if (this._length === 0) {
		return true;
	}
	const iterator = this.value();
	const value = iterator.next();
	return value.done;
};

Sequence.prototype.isSingleton = function () {
	if (this._length === 0) {
		return false;
	}

	if (this._length === 1) {
		return true;
	}

	const iterator = this.value();

	let value = iterator.next();
	if (value.done) {
		return false;
	}
	value = iterator.next();
	return value.done;
};

Sequence.prototype.getLength = function (keepItems = true) {
	if (this._length !== null) {
		return this._length;
	}
	let length = 0;

	const iterator = this.value();
	let item = iterator.next();
	while (!item.done) {
		if (keepItems) {
			this._cachedValues[length] = item.value;
		}
		length++;
		item = iterator.next();
	}
	this._length = length;
	return length;
};

Sequence.prototype.getEffectiveBooleanValue = function () {
	const iterator = this.value();
	const firstValue = iterator.next();
	if (firstValue.done) {
		return false;
	}
	if (firstValue.value instanceof NodeValue) {
		return true;
	}
	const secondValue = iterator.next();
	if (!secondValue.done) {
		throw new Error('FORG0006: A wrong argument type was specified in a function call.');
	}
	return firstValue.value.getEffectiveBooleanValue();
};

/**
 * @constructor
 * @extends Sequence
 */
function EmptySequence () {
	Item.call(this, () => (
		{
			[Symbol.iterator]: function () { return this; },
			next: () => ({ done: true })
		}
	));
}
EmptySequence.prototype.getEffectiveBooleanValue = () => false;
EmptySequence.prototype.first = () => null;
EmptySequence.prototype.isEmpty = () => true;
EmptySequence.prototype.getAllValues = () => [];
EmptySequence.prototype.getLength = () => 0;
EmptySequence.prototype.isSingleton = () => false;
const emptySequence = new EmptySequence();

EmptySequence.prototype.atomize = EmptySequence.prototype.filter = EmptySequence.prototype.map = () => emptySequence;

let singletonTrueSequence;
let singletonFalseSequence;

/**
 * @extends Sequence
 * @constructor
 */
function SingletonSequence (onlyValue) {
	if (onlyValue === BooleanValue.FALSE) {
		if (singletonFalseSequence) {
			return singletonFalseSequence;
		}
		singletonFalseSequence = this;
	}

	if (onlyValue === BooleanValue.TRUE) {
		if (singletonTrueSequence) {
			return singletonTrueSequence;
		}
		singletonTrueSequence = this;
	}

	Item.call(this, () => {
		let hasPassed = false;
		return {
			[Symbol.iterator]: function () { return this; },
			next: () => {
				if (hasPassed) {
					return { done: true };
				}
				hasPassed = true;
				return { done: false, value: onlyValue };
			}
		};
	});
	this._onlyValue = onlyValue;
	this._effectiveBooleanValue = null;
}
SingletonSequence.prototype.getEffectiveBooleanValue = function () {
	if (this._effectiveBooleanValue === null) {
		this._effectiveBooleanValue = this._onlyValue.getEffectiveBooleanValue();
	}
	return this._effectiveBooleanValue;
};
SingletonSequence.prototype.first = function () {
	return this._onlyValue;
};
SingletonSequence.prototype.getAllValues = function () {
	return [this._onlyValue];
};
SingletonSequence.prototype.isEmpty = () => false;
SingletonSequence.prototype.getLength = () => 1;
SingletonSequence.prototype.isSingleton = () => true;
SingletonSequence.prototype.atomize = function (dynamicContext) {
	return new SingletonSequence(this._onlyValue.atomize(dynamicContext));
};
SingletonSequence.prototype.filter = function (cb) {
	if (cb(this._onlyValue, 0, this)) {
		return this;
	}
	return emptySequence;
};
SingletonSequence.prototype.map = function (cb) {
	return new SingletonSequence(cb(this._onlyValue, 0, this));
};

/**
 * @constructor
 * @extends Sequence
 */
function ArrayBackedSequence (values) {
	if (!values.length) {
		return emptySequence;
	}
	if (values.length === 1) {
		return new SingletonSequence(values[0]);
	}
	Item.call(this, () => {
		let i = -1;
		return {
			[Symbol.iterator]: function () { return this; },
			next: () => {
				i++;
				if (i >= values.length) {
					return { done: true };
				}
				return { done: false, value: values[i] };
			}
		};
	});

	this._values = values;
}
ArrayBackedSequence.prototype.isEmpty = () => false;
ArrayBackedSequence.prototype.isSingleton = () => false;
ArrayBackedSequence.prototype.first = function () {
	return this._values[0];
};
ArrayBackedSequence.prototype.getAllValues = function () {
	return this._values.concat();
};
ArrayBackedSequence.prototype.getEffectiveBooleanValue = function () {
	if (this._values[0] instanceof NodeValue) {
		return true;
	}
	// We always have a length > 1, or we'd be a singletonSequence
	throw new Error('FORG0006: A wrong argument type was specified in a function call.');
}
ArrayBackedSequence.prototype.filter = function (cb) {
	let i = -1;
	return new Sequence({
		next: () => {
			i++;
			while (i < this._values.length && !cb(this._values[i], i, this)) {
				i++;
			}

			if (i >= this._values.length) {
				return { done: true };
			}

			return { done: false, value: this._values[i] };
		}
	});
};
ArrayBackedSequence.prototype.map = function (cb) {
	let i = -1;
	return new Sequence({
		next: () => {
			i++;
			if (i >= this._values.length) {
				return { done: true };
			}
			return { done: false, value: cb(this._values[i], i, this) };
		}
	});
};
ArrayBackedSequence.prototype.getLength = function () {
	return this._values.length;
};
ArrayBackedSequence.prototype.atomize = function (dynamicContext) {
	return this.map(value => value.atomize(dynamicContext));
};
/**
 * @param   {!Item}  value
 * @return  {!Sequence}
 */
Sequence.singleton = function (value) {
    return new SingletonSequence(value);
};

/**
 * @return  {!Sequence}
 */
Sequence.empty = function () {
	return emptySequence;
};


export default Sequence;
