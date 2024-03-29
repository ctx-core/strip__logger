#!/usr/bin/env node
/**
 * @module @ctx-core/logger/strip-logger
 * @see {@link https://github.com/sindresorhus/strip-debug}
 */
import fs from 'node:fs'
import rocambole from 'rocambole'
import strip__debugger from 'rocambole-strip-debugger'
import strip__console from 'rocambole-strip-console'
import strip__alert from 'rocambole-strip-alert'
import updateNode from 'rocambole-node-update'
// esprima@2.1 introduces a "handler" property on TryStatement, so we would
// loop the same node twice (see jquery/esprima/issues/1031 and #264)
rocambole.BYPASS_RECURSION.handler = true
export function main() {
	const { argv } = process
	const file = argv[2]
	let src
	if (file) {
		src = fs.readFileSync(file, 'utf8')
		output_strip_logger(src)
	} else {
		const src_a:string[] = []
		process.stdin.on('readable', () => {
			const chunk = process.stdin.read().toString
			if (chunk) {
				src_a.push(chunk)
			}
		})
		process.stdin.on('end', () => {
			src = src_a.join('')
			output_strip_logger(src)
		})
	}
}
export function output_strip_logger(src) {
	console.info(strip__logger(src).toString())
}
export function strip__logger(src) {
	return rocambole.moonwalk(src, node => {
		strip__debugger(node)
		strip__console(node)
		strip__alert(node)
		FN__strip__logger(node)
	})
}
function FN__strip__logger(node) {
	if (node.type !== 'CallExpression') {
		return
	}
	const main = node.callee
	if (
		main.type === 'Identifier'
		&& (
			main.name === 'log'
			|| main.name === 'log$$1'
			|| main.name === 'debug'
			|| main.name === 'debug$$1'
		)) {
		updateNode(node, 'void 0')
	}
}
