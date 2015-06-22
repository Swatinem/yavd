import * as jsx from "./jsx"
import apply from "./props"
import Codegen from "./codegen"
import Instance from "./instance"

const doc = document.implementation.createHTMLDocument("")

export default class Compiler {
  constructor(vnode) {
    this.template = doc.createDocumentFragment()
    this.codegen = new Codegen(this.name(vnode))
    this.template.appendChild(this.vnode(vnode))
  }
  finish() {
    const {template, codegen} = this
    return {
      template,
      update: codegen.update(),
      mount: codegen.mount(template),
      unmount: codegen.unmount(),
    }
  }

  name(vnode) {
    if (typeof vnode === "string") {
      return "_text_"
    }
    const {type} = vnode
    if (typeof type === "string") {
      return `_${type}_`
    }
    return "_other_"
  }

  // generic visitor for all kinds of vnodes
  vnode(vnode) {
    if (typeof vnode === "string") {
      this.codegen.static()
      return doc.createTextNode(vnode)
    }
    const {type} = vnode
    if (typeof type === "string") {
      return this.tag(vnode)
    }
    if (type === jsx.props) {
      return this.text(vnode)
    }
    return this.component(vnode)
    // TODO: support other node types
    // such as components and seq/match/children!
  }
  // an embedded component
  component(vnode) {
    const instance = Instance(vnode.type)
    this.codegen.component(instance, vnode.props)
    return instance.template.cloneNode(true)
  }
  // dynamic text
  text(vnode) {
    const elem = doc.createTextNode("")
    this.codegen.text(vnode.props)
    return elem
  }
  // simple tags
  tag(vnode) {
    const elem = doc.createElement(vnode.type)
    this.codegen.static()
    this.props(vnode.props, elem)
    this.children(vnode.children, elem)
    return elem
  }
  // props of simple tags
  props(props, elem) {
    const keys = Object.keys(props)
    for (const key of keys) {
      const value = props[key]
      // TODO: event binding and stuff
      if (typeof value === "object" && value.type === jsx.props) {
        // this is a special prop
        this.codegen.prop(key, value.props)
      } else {
        apply(elem, key, value)
      }
    }
  }
  // children of a fragment
  children(children, elem) {
    if (!children.length) { return }
    const {codegen} = this
    codegen.push()
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i]
      elem.insertBefore(this.vnode(child), elem.firstChild)
    }
    codegen.pop()
  }
}
