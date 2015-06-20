import apply from './props.js'

export default class Codegen {
  constructor() {
    this.maxDepth = 0
    this.propfns = [] // accessor functions for dynamic props
    this.code = []
    this.stack = [{generated: true, hadStatic: false}]
  }
  push() {
    this.stack.push({
      generated: false,
      hadStatic: false,
    })
    let n = this.depth
    this.maxDepth = Math.max(n, this.maxDepth)
  }
  pop() {
    this.stack.pop()
  }
  get depth() {
    return this.stack.length - 1
  }
  get top() {
    return this.stack[this.stack.length - 1]
  }
  // this generates the preamble for the next static item, such as a tag or
  // text node
  static() {
    let n = this.depth
    if (!n) { return }
    let {hadStatic, generated} = this.top
    if (!generated) {
      // this tag is the first in this stack, so get the lastChild
      this.code.push(`node${n} = node${n - 1}.lastChild`)
    } else if (hadStatic) {
      // we already had a tag before, so node is guaranteed to be !== null
      this.code.push(`node${n} = node${n}.previousSibling`)
    } else {
      // we are in front of a fragment. that fragment may not have generated
      // any elements yet
      this.code.push(`node${n} = node${n} ? node${n}.previousSibling : node${n - 1}.lastChild`)
    }
    this.top.hadStatic = this.top.generated = true
  }
  // TODO
  fragment(fn) {
    let {depth: n, top} = this
    if (!top.generated) {
      this.code.push(`node${n} = null`)
    }
    top.generated = true
  }
  propfn(fn) {
    return this.propfns.push(fn) - 1
  }
  text(fn) {
    let n = this.propfn(fn)
    this.static()
    this.code.push(`node${this.depth}.data = propfns[${n}](props, state)`)
  }
  prop(key, fn) {
    let n = this.propfn(fn)
    this.code.push(`apply(node${this.depth}, '${key}', propfns[${n}](props, state))`)
  }
  // generates the code for the populate function
  populateFn() {
    let decl = Array.from(Array(this.maxDepth + 1))
      .map((_, i) => `node${i}`).join(', ')
    let code = 'return function (node, props, state) {\n' +
      '  var ' + decl + '\n' +
      '  node0 = node\n  ' +
      this.code.join('\n  ') +
      '\n  return node0\n}'
    // XXX: remove once the codegen works correctly
    console.log(code)
    return Function('apply, propfns', code)(apply, this.propfns)
  }
  // generates the code to remove the element from its parent
  removeFn() {
    // TODO: interleave code to remove all static children interleaved with
    // calls to remove the children of dynamic fragments
    let code = 'return function (node) {\n' +
      '  node.parentNode.removeChild(node)\n' +
      '\n}'
    return Function('', code)()
  }
}
