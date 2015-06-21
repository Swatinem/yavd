import apply from "./props.js"

export default class Codegen {
  constructor() {
    this.maxDepth = 0
    this.propfns = [] // accessor functions for dynamic props
    this.mountCode = []
    this.updateCode = []
    this.unmountCode = []
    this.stack = [{generated: true, hadStatic: false}]
  }
  push() {
    this.stack.push({
      generated: false,
      hadStatic: false,
    })
    const n = this.depth
    this.maxDepth = Math.max(n, this.maxDepth)
  }
  pop() {
    this.stack.pop()
  }
  get depth() {
    return this.stack.length
  }
  get top() {
    return this.stack[this.stack.length - 1]
  }
  // this generates the preamble for the next static item, such as a tag or
  // text node
  static() {
    const n = this.depth
    const {hadStatic, generated} = this.top
    let code
    if (!generated) {
      // this tag is the first in this stack, so get the lastChild
      code = `node${n} = node${n - 1}.lastChild`
    } else if (hadStatic) {
      // we already had a tag before, so node is guaranteed to be !== null
      code = `node${n} = node${n}.previousSibling`
    } else {
      // we are in front of a fragment. that fragment may not have generated
      // any elements yet
      code = `node${n} = node${n} ? node${n}.previousSibling : node${n - 1}.lastChild`
    }
    this.updateCode.push(code)
    this.mountCode.push(code)
    if (n === 1) {
      this.unmountCode.push(`node0.removeChild(node1 ? node1.previousSibling : node0.lastChild)`)
    }
    this.top.hadStatic = this.top.generated = true
  }
  // TODO
  fragment(fn) {
    //const {depth: n, top} = this
    //if (!top.generated) {
    //  this.updateCode.push(`node${n} = null`)
    //}
    //top.generated = true
  }
  propfn(fn) {
    return this.propfns.push(fn) - 1
  }
  text(fn) {
    const n = this.propfn(fn)
    this.static()
    const code = `node${this.depth}.data = propfns[${n}](props, state)`
    this.updateCode.push(code)
    this.mountCode.push(code)
  }
  prop(key, fn) {
    const n = this.propfn(fn)
    const code = `apply(node${this.depth}, "${key}", propfns[${n}](props, state))`
    this.updateCode.push(code)
    this.mountCode.push(code)
  }
  declCode(props = false) {
    const decl = Array.from(Array(this.maxDepth + 1))
      .map((_, i) => `node${i}`).join(", ")
    return "  var " + decl + "\n" +
      (props ? "  var props = data.props, state = data.state\n" : "") +
      "  node0 = location.parent, node1 = location.before\n"
  }
  mount(template) {
    const code = "return function (mountlocation, data, reuse) {\n" +
      "  var location = {parent: reuse || template, before: null}\n" +
      this.declCode(true, false) +
      `  ${this.mountCode.join("\n  ")}\n` +
      "  var node = reuse || document.importNode(template)\n" +
      "  mountlocation.parent.insertBefore(node, mountlocation.before)\n" +
      "}"
    return Function("apply, propfns, template", code)(apply, this.propfns, template)
  }
  // generates the code for the populate function
  update() {
    const code = "return function (location, data) {\n" +
      this.declCode(true) +
      `  ${this.updateCode.join("\n  ")}\n` +
      "}"
    return Function("apply, propfns", code)(apply, this.propfns)
  }
  // generates the code to remove the element from its parent
  unmount() {
    const code = "return function (location) {\n" +
      this.declCode() +
      `  ${this.unmountCode.join("\n  ")}\n` +
      "}"
    return Function("", code)()
  }
}
