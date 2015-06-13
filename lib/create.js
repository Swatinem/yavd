import apply from './props'
import {Instance, render} from './instance'

export default function create(vnode, doc = document, parent = null) {
  if (typeof vnode !== 'object') {
    return doc.createTextNode(String(vnode))
  }

  if (typeof vnode.type === 'string') {
    // TODO: support creating namespaced elements
    let node = doc.createElement(vnode.type)

    // apply all the props
    apply(node, {}, vnode.props)

    // create the children
    // XXX: babel generates quite some code for a simple for-of loop :-(
    let children = vnode.props.children
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      node.appendChild(create(child, doc, parent))
    }
    return node
  }

  let instance = Instance(vnode)
  if (parent) {
    parent.add(instance)
  }
  let elem = create(render(instance), doc, instance.children)
  instance.elem = elem
  return elem
}
