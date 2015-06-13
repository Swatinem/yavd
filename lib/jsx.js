export default function jsx(type, _props, ...children) {
  // flatten and remove empty children
  children = children.reduce((acc, child) => {
    if (Array.isArray(child)) {
      acc.push.apply(acc, child)
    } else if (child || typeof child === 'number') {
      acc.push(child)
    }
    return acc
  }, [])
  let props = Object.assign({children}, _props)
  let vnode = {type, props}
  if (props.key) {
    vnode.key = props.key
  }
  return vnode
}
