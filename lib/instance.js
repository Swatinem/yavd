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
  let instance = {
    component,
    obj: {props, state},
    vnode: null,
    elem: null,
    children: new Set(),
  }

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

export function beforeMount(instances) {
  instances.forEach(instance => {
    let {component, obj, children} = instance
    if (component.beforeMount) {
      component.beforeMount(obj)
    }
    beforeMount(children)
  })
}

export function afterMount(instances) {
  instances.forEach(instance => {
    let {component, obj, elem, children} = instance
    if (component.afterMount) {
      component.afterMount(obj, elem)
    }
    afterMount(children)
  })
}

export function beforeUnmount(instances) {
  instances.forEach(instance => {
    let {component, obj, elem, children} = instance
    if (component.beforeUnmount) {
      component.beforeUnmount(obj, elem)
    }
    beforeUnmount(children)
  })
}
