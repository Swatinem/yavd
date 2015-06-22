import Compiler from "./compiler"

export class Instance {
  constructor(compiled) {
    this.compiled = compiled
    this.template = this.compiled.template

    this.data = null
    this.location = null
    //this.mounted = false
  }
  mount(location, props, embedded = false) {
    const {compiled, template} = this
    this.data = {
      props,
      state: {},
    }
    if (embedded) {
      return compiled.mount(location, this.data)
    }
    compiled.mount({parent: template, before: null}, this.data)
    const node = document.importNode(template, true)
    const before = node.firstChild
    location.parent.insertBefore(node, location.before)
    this.location = location
    return before
  }
  update(props, location = this.location) {
    const {compiled, data} = this
    data.props = props
    return compiled.update(location, data)
  }
  unmount() {
    return this.compiled.unmount(this.location)
  }
}

// TODO: cache and reuse!
export default function instance(vnode) {
  const compiler = new Compiler(vnode)
  return new Instance(compiler.finish())
}
