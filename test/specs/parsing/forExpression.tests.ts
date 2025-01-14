import * as chai from 'chai';
import * as slimdom from 'slimdom';
import jsonMlMapper from 'test-helpers/jsonMlMapper';

import {
	evaluateXPath,
	evaluateXPathToAsyncIterator,
	evaluateXPathToBoolean,
	evaluateXPathToNumber,
	evaluateXPathToNumbers,
} from 'fontoxpath';

let documentNode;
beforeEach(() => {
	documentNode = new slimdom.Document();
});

describe('for expressions', () => {
	it('works', () => {
		chai.assert.isTrue(
			evaluateXPathToBoolean('(for $i in (1 to 10) return $i) => count() = 10', documentNode)
		);
	});
	it('can be chained', () => {
		chai.assert.equal(
			evaluateXPathToNumber(
				'(for $i in (1 to 10), $y in (1 to $i) return $y) => count()',
				documentNode
			),
			55
		);
	});
	it('can be chained multiple times', () => {
		chai.assert.equal(
			evaluateXPathToNumber(
				'(for $i in (1 to 10), $y in (1 to $i), $z in ($y to $i) return $z) => count()',
				documentNode
			),
			220
		);
	});
	it('supports positionalVariableBindings', () => {
		chai.assert.deepEqual(
			evaluateXPathToNumbers('for $item at $index in (4,5,6) return ($item, $index)'),
			[4, 1, 5, 2, 6, 3]
		);
	});
	it('supports variableBindings and positionalVariableBindings with namespaces', () => {
		chai.assert.deepEqual(
			evaluateXPathToNumbers(
				'declare namespace prefix = "URI"; for $prefix:item at $prefix:index in (4,5,6) return ($Q{URI}item, $Q{URI}index)',
				null,
				null,
				null,
				{ language: evaluateXPath.XQUERY_3_1_LANGUAGE }
			),
			[4, 1, 5, 2, 6, 3]
		);
	});
	it('can be multiple times over nodes, without deduplication, sorting, or whatever', () => {
		jsonMlMapper.parse(
			[
				'someElement',
				[
					'someElement',
					['someElement', { someAttribute: 'someValue' }],
					['someElement', { someAttribute: 'someValue' }],
				],
				[
					'someElement',
					['someElement', { someAttribute: 'someValue' }],
					['someElement', { someAttribute: 'someValue' }],
				],
				[
					'someElement',
					['someElement', { someAttribute: 'someValue' }],
					['someElement', { someAttribute: 'someValue' }],
				],
			],
			documentNode
		);
		chai.assert.equal(
			evaluateXPathToNumber(
				'(let $roots := /someElement return for $ele in $roots/someElement, $y in $ele/../someElement, $z in $y/someElement return $z/@*) => count()',
				documentNode
			),
			18
		);
	});

	it('defined prefixless variables in the empty namespace', () => {
		chai.assert.isTrue(
			evaluateXPathToBoolean(
				'<element xmlns="XXX">{for $x in ("A") return $Q{}x}</element> = "A"',
				documentNode,
				null,
				null,
				{ language: evaluateXPath.XQUERY_3_1_LANGUAGE }
			)
		);
	});
});
