import * as chai from 'chai';
import sequenceFactory from 'fontoxpath/expressions/dataTypes/sequenceFactory';
import { ValueType } from 'fontoxpath/expressions/dataTypes/Value';
import argumentListToString from 'fontoxpath/expressions/functions/argumentListToString';

describe('argumentListToString()', () => {
	it('returns item()? when given an empty Sequence', () => {
		const argumentList = [sequenceFactory.create([])];
		chai.assert.equal(argumentListToString(argumentList), 'item()?');
	});

	it('returns type when given a Sequence with 1 item', () => {
		const argumentList = [
			sequenceFactory.create([
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
			]),
		];
		chai.assert.equal(argumentListToString(argumentList), 'xs:anyAtomicType');
	});

	it('returns type when given a Sequence with multiple items', () => {
		const argumentList = [
			sequenceFactory.create([
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
			]),
		];
		chai.assert.equal(argumentListToString(argumentList), 'xs:anyAtomicType+');
	});

	it('returns a type list when given multiple Sequences', () => {
		const argumentList = [
			sequenceFactory.create([]),
			sequenceFactory.create([
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
			]),
			sequenceFactory.create([
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
				{
					type: ValueType.XSANYATOMICTYPE,
					value: null,
				},
			]),
		];
		chai.assert.equal(
			argumentListToString(argumentList),
			'item()?, xs:anyAtomicType, xs:anyAtomicType+'
		);
	});
});
