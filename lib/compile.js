import * as jsx from './jsx'
import apply from './props'
import Codegen from './codegen'

const foreignDoc = document.implementation.createHTMLDocument('')

export default function compile(vnode, doc = foreignDoc) {
  let codegen = new Codegen()
  let compiler = new Compiler(codegen, doc)
  let node = compiler.vnode(vnode)
  return {node, populate: codegen.generate()}
}

class Compiler {
  constructor(codegen, doc) {
    this.codegen = codegen
    this.doc = doc
  }
  // generic visitor for all kinds of vnodes
  vnode(vnode) {
    if (typeof vnode === 'string') {
      this.codegen.static()
      return this.doc.createTextNode(vnode)
    }
    let {type} = vnode
    if (typeof type === 'string') {
      return this.tag(vnode)
    }
    if (type === jsx.props) {
      return this.text(vnode)
    }
    // TODO: support other node types
  }
  // dynamic text
  text(vnode) {
    let {codegen, doc} = this
    let elem = doc.createTextNode('')
    codegen.text(vnode.props)
    return elem
  }
  // simple tags
  tag(vnode) {
    let {codegen, doc} = this
    let elem = doc.createElement(vnode.type)
    codegen.static()
    this.props(vnode.props, elem)
    this.children(vnode.children, elem)
    return elem
  }
  // props of simple tags
  props(props, elem) {
    let {codegen} = this
    let keys = Object.keys(props)
    for (let key of keys) {
      let value = props[key]
      // TODO: event binding and stuff
      if (typeof value === 'object' && value.type === jsx.props) {
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
    let {codegen} = this
    codegen.push()
    for (let i = children.length - 1; i >= 0; i--) {
      let child = children[i];
      elem.insertBefore(this.vnode(child), elem.firstChild)
    }
    codegen.pop()
  }
}
