import apply from './props.js'

export default class Codegen {
  constructor() {
    this.depth = 0
    this.maxDepth = 0
    this.propfns = [] // accessor functions for dynamic props
    this.code = []
  }
  push() {
    let n = this.depth += 1
    this.maxDepth = Math.max(this.depth, this.maxDepth)
    this.code.push(`node${n} = node${n - 1}.lastChild`)
  }
  pop() {
    this.depth -= 1
  }
  prev() {
    let n = this.depth
    this.code.push(`node${n} = node${n}.previousSibling`)
  }
  propfn(fn) {
    return this.propfns.push(fn) - 1
  }
  prop(key, fn) {
    let n = this.propfn(fn)
    this.code.push(`apply(node${this.depth}, '${key}', propfns[${n}](props, state))`)
  }
  text(fn) {
    let n = this.propfn(fn)
    this.code.push(`node${this.depth}.data = propfns[${n}](props, state)`)
  }
  generate() {
    let decl = Array.from(Array(this.maxDepth + 1))
      .map((_, i) => `elem${i}`).join(', ')
    let code = 'return function (node, props, state) {\n' +
      '  var ' + decl + '\n' +
      '  node0 = node\n  ' +
      this.code.join('\n  ') +
      '\n}'
    console.log(code)
    return Function('apply, propfns', code)(apply, this.propfns)
  }
}
