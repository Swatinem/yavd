// Component => {instances: Props => Instance}
const COMPONENTS = new WeakMap()

export function Instance(vnode) {
  let component = vnode.type
  let props = vnode.props

  if (!COMPONENTS.has(component)) {
    COMPONENTS.set(component, {instances: new WeakMap()})
  }
  let cached = COMPONENTS.get(component)
  if (cached.instances.has(props)) {
    return cached.instances.get(props)
  }

  let state = component.initialState ? component.initialState(props) : {}
  let instance = {component, obj: {props, state}, vnode: null}

  cached.instances.set(props, instance)
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
