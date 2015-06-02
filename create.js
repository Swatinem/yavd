import applyProps from './applyprops'

export default function create(vnode, doc = document) {
  if (typeof vnode !== 'object') {
    return doc.createTextNode(String(vnode))
  }

  if (typeof vnode.type === 'string') {
    // TODO: support creating namespaced elements
    let node = doc.createElement(vnode.type)

    // apply all the props
    let props = vnode.props
    for (let key in props) {
      if (key === 'children') { continue }
      let prop = props[key]
      if (prop && typeof prop === 'object') {
        applyProps(node[key], prop)
      } else {
        node[key] = prop
      }
    }

    // create the children
    // XXX: babel generates quite some code for a simple for-of loop :-(
    for (let i = 0, len = props.children.length; i < len; i++) {
      let child = props.children[i]
      node.appendChild(create(child, doc))
    }
    return node
  }

  // TODO: figure out how to treat components
}
