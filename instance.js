// Component => {instances: Props => Instance}
const COMPONENTS = new WeakMap()

export function meta(vnode) {
  let component = vnode.type

  if (!COMPONENTS.has(component)) {
    COMPONENTS.set(component, {instances: new WeakMap()})
  }
  return COMPONENTS.get(component)
}

export function Instance(vnode) {
  let {type: component, props} = vnode
  let _meta = meta(vnode)

  if (_meta.instances.has(props)) {
    return _meta.instances.get(props)
  }

  let state = component.initialState ? component.initialState(props) : {}
  let instance = {component, obj: {props, state}, vnode: null}

  _meta.instances.set(props, instance)
  return instance
}

export function render(instance) {
  let {component} = instance
  let renderFn = component.render || component
  return instance.vnode = renderFn(instance.obj)
}

export function updateProps(instance, props) {
  let {component, obj} = instance
  obj.props = props
  // TODO: lifecycle
}
