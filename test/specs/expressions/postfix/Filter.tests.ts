import * as chai from 'chai';
import Expression from 'fontoxpath/expressions/Expression';
import Filter from 'fontoxpath/expressions/postfix/Filter';
import Specificity from 'fontoxpath/expressions/Specificity';
import * as sinon from 'sinon';

describe('Filter', () => {
	let equalExpression;

	beforeEach(() => {
		equalExpression = {
			specificity: new Specificity({}),
			equals: sinon.stub().returns(true),
		};
	});

	describe('Filter.getBucket()', () => {
		it('returns the bucket of its selector', () => {
			const filter = new Filter(
				{
					getBucket: () => 'name-just-for-testing',
					specificity: new Specificity({}),
				} as unknown as Expression,
				equalExpression
			);
			chai.assert.equal(filter.getBucket(), 'name-just-for-testing');
		});
	});

	describe('Filter.specificity', () => {
		it('returns the specificity of the selector plus the other part', () => {
			const filter = new Filter(
				{ specificity: new Specificity({ external: 1 }) } as Expression,
				{ specificity: new Specificity({ external: 1 }) } as Expression
			);
			chai.assert.equal(
				filter.specificity.compareTo(new Specificity({ external: 2 })),
				0,
				'should be of equal specificity'
			);
		});
	});
});
