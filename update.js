import create from './create'
import applyProps from './applyprops'
import {Instance, render, updateProps} from './instance'

export default function update(node, prev, next) {
  if (prev === next) { return }

  if (typeof next !== 'object' && typeof prev !== 'object') {
    // both are text nodes
    node.data = String(next)
  } else if (typeof next !== 'object' || typeof prev !== 'object' ||
             prev.type !== next.type) {
    // their types differ, so replace the node
    // XXX: when adding namespaced tag support, make sure to also check for
    // that prop here
    node.parentNode.replaceChild(create(next), node)
  } else if (typeof next.type === 'string') {
    // its the same type

    // patch the props
    for (let key in next.props) {
      let prop = next.props[key]
      if (key === 'children' || prop === prev.props[key]) { continue }
      if (prop && typeof prop === 'object') {
        applyProps(node[key], prop)
      } else {
        node[key] = prop
      }
      // TODO: remove props that are not present any more
    }

    // and patch the children
    updateChildren(node, prev.props.children, next.props.children)
  } else {
    let instance = Instance(prev)
    updateProps(instance, next.props)
    let prevVnode = instance.vnode
    let nextVnode = render(instance)
    update(node, prevVnode, nextVnode)
  }
}

function updateChildren(node, prev, next) {
  // XXX: actually make an intelligent patcher here, for now im lazy and will
  // just linearly iterate over all the children. reordering by keys will come
  // later, for now I just want to get the lifecycle and things going
  let len = Math.min(prev.length, next.length)
  for (let i = 0; i < len; i++) {
    update(node.childNodes[i], prev[i], next[i])
  }
  // add new children if we have more
  for (let i = len, len = next.length; i < len; i++) {
    node.appendChild(create(next[i]))
  }
  // or remove old children if we have more
  for (let i = len, len = prev.length; i < len; i++) {
    node.removeChild(node.lastChild)
  }
}
