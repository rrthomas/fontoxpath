import { evaluateXPath } from 'fontoxpath';

/**
 * Known XPath/XQuery error codes which are not treated as a crash.
 * 
 * https://www.w3.org/2005/xqt-errors/
 */
const EXPECTED_ERROR_PREFIXES = [
	'FOAP',
	'FOAR',
	'FOAY',
	'FOCA',
	'FOCH',
	'FODC',
	'FODF',
	'FODT',
	'FOER',
	'FOFD',
	'FOJS',
	'FONS',
	'FOQM',
	'FORG',
	'FORX',
	'FOTY',
	'FOUT',
	'FOXT',
	'XPDY',
	'XPST',
	'XPTY',
	'XQDY',
	'XQST',
	'XQTY'
];

/**
 * Interface for fuzzer which are run by the {@link Engine}.
 */
export interface IFuzzer {
	globalInit(): void;
	prepareCase(): FuzzCase;
}

/**
 * A single executable fuzz case.
 */
export class FuzzCase {
	contextItem?: any | null;
	language: string;
	selector: string;

	constructor(selector: string, language: string, contextItem?: any | null) {
		this.selector = selector;
		this.language = language;
		this.contextItem = contextItem;
	}

	/**
	 * Tests whether the given error is expected,
	 * meaning the error should not be considered a crash.
	 * 
	 * @param error - The {@link Error} which to test.
	 * @returns Returns `true` when expected.
	 */
	isExpectedError(error: Error): boolean {
		return EXPECTED_ERROR_PREFIXES.some(prefix => error.message.startsWith(prefix));
	}

	/**
	 * Run this fuzz case.
	 */
	run(): void {
		// Execute the expression
		evaluateXPath(this.selector, this.contextItem, null, null, null, {
			disableCache: true,
			language: this.language
		});
	}
}
