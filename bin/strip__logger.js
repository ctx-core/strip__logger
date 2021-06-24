#!/usr/bin/env node
/**
 * @module @ctx-core/logger/strip-logger
 * @see {@link https://github.com/sindresorhus/strip-debug}
 */
const fs = require('fs')
const { output_strip_logger } = require('../lib')
main()
function main() {
	const { argv } = process
	const file = argv[2]
	let src
	if (file) {
		src = fs.readFileSync(file, 'utf8')
		output_strip_logger(src)
	} else {
		const a1__src = []
		process.stdin.on('readable', () => {
			const chunk = process.stdin.read()
			if (chunk) {
				a1__src.push(chunk)
			}
		})
		process.stdin.on('end', () => {
			src = a1__src.join('')
			output_strip_logger(src)
		})
	}
}
