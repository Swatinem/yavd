import * as jsx from "./jsx"
import apply from "./props"

export default class Codegen {
  constructor(name) {
    this.maxDepth = 0
    this.stack = [{generated: true, hadStatic: false}]
    this.name = name

    this.propfns = [] // accessor functions for dynamic props
    this.fragments = [] // embedded fragment instances

    this.mountCode = []
    this.updateCode = []
    this.unmountCode = []
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
  propfn(fn) {
    return this.propfns.push(fn) - 1
  }
  component(instance, props) {
    const n = this.fragments.push(instance) - 1
    const d = this.depth

    let hadDynamic = false
    const updateProps = Object.keys(props).map(key => {
      const prop = props[key]
      const isProp = prop && prop.type === jsx.props
      hadDynamic = hadDynamic || isProp
      return JSON.stringify(key) + ": " +
        (isProp
          ? `propfns[${this.propfn(prop.props)}](props, state)`
          : JSON.stringify(prop))
    }).join(", ")
    const loc = `{parent: node${d - 1}, before: node${d}}`

    this.mountCode.push(`node${d} = fragments[${n}].mount(${loc}, {${updateProps}}, true)`)
    // TODO: try to avoid an update if we had no dynamic props at all!
    //if (hadDynamic) {
    this.updateCode.push(`node${d} = fragments[${n}].update({${updateProps}}, ${loc})`)
    // a component is completely embedded
    if (d === 1) {
      this.unmountCode.push(`node1 = fragments[${n}].compiled.unmount({parent: node0, before: node1})`)
    }
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
    const decl = Array.from(Array(this.maxDepth + 2))
      .map((_, i) => `node${i}`).join(", ")
    return "  var " + decl + "\n" +
      (props ? "  var props = data.props, state = data.state\n" : "") +
      "  node0 = location.parent, node1 = location.before\n"
  }
  bindfn(code) {
    //console.log(code)
    return Function(
      "apply, propfns, fragments",
      "return " + code)(
        apply, this.propfns, this.fragments)
  }
  mount(template) {
    const code = `function mount_${this.name}(location, data) {\n` +
      this.declCode(true) +
      `  ${this.mountCode.join("\n  ")}\n` +
      "  return node1\n}"
    return this.bindfn(code)
  }
  // generates the code for the populate function
  update() {
    const code = `function update_${this.name}(location, data) {\n` +
      this.declCode(true) +
      `  ${this.updateCode.join("\n  ")}\n` +
      "  return node1\n}"
    return this.bindfn(code)
  }
  // generates the code to remove the element from its parent
  unmount() {
    const code = `function unmount_${this.name}(location) {\n` +
      this.declCode() +
      `  ${this.unmountCode.join("\n  ")}\n` +
      "}"
    return this.bindfn(code)
  }
}
