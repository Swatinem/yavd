export default function jsx(type, _props, ...children) {
  /* istanbul ignore if */
  if (children.length === 1 && Array.isArray(children[0])) {
    children = children[0];
  }
  let props = Object.assign({children}, _props)
  let vnode = {type, props}
  if (props.key) {
    vnode.key = props.key
  }
  return vnode
}
