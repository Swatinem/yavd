import create from './create'
import update from './update'

const INSTANCES = new WeakMap()

export function Instance(vnode) {
  let component = vnode.type
  let props = vnode.props

  if (!INSTANCES.has(component)) {
    INSTANCES.set(component, new WeakMap())
  }
  let cached = INSTANCES.get(component)
  if (cached.has(props)) {
    return cached.get(props)
  }

  let state = component.initialState ? component.initialState(props) : {}
  let instance = {component, obj: {props, state}, vnode: null}

  cached.set(props, instance)
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
