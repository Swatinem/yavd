import * as jsx from "./jsx"
import apply from "./props"

const foreignDoc = document.implementation.createHTMLDocument("")

export default class Compiler {
  constructor(codegen, {doc = foreignDoc, embed = false}) {
    this.codegen = codegen
    this.doc = doc
    this.embed = embed
  }
  // generic visitor for all kinds of vnodes
  vnode(vnode) {
    if (typeof vnode === "string") {
      this.codegen.static()
      return this.doc.createTextNode(vnode)
    }
    const {type} = vnode
    if (typeof type === "string") {
      return this.tag(vnode)
    }
    if (type === jsx.props) {
      return this.text(vnode)
    }
    // TODO: support other node types
  }
  // dynamic text
  text(vnode) {
    const {codegen, doc} = this
    const elem = doc.createTextNode("")
    codegen.text(vnode.props)
    return elem
  }
  // simple tags
  tag(vnode) {
    const {codegen, doc} = this
    const elem = doc.createElement(vnode.type)
    codegen.static()
    this.props(vnode.props, elem)
    this.children(vnode.children, elem)
    return elem
  }
  // props of simple tags
  props(props, elem) {
    const {codegen} = this
    const keys = Object.keys(props)
    for (const key of keys) {
      const value = props[key]
      // TODO: event binding and stuff
      if (typeof value === "object" && value.type === jsx.props) {
        // this is a special prop
        codegen.prop(key, value.props)
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

