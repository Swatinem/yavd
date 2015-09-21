import Data from "./data.js"
import ElementRequest from "./request.js"

// hidden properties on a component for the current props/state
const _props = Symbol("props")
const _state = Symbol("state")
// the generation is used to guard against stale data from the async
// `SetStateFn`. the generation is incremented on every reuse
const _generation = Symbol("generation")
// the stateFn will be passed to `init` and `update` to receive updated state.
// it is also being abused to check whether a component is initialized. a falsy
// value means it needs to be initialized via `init`, a truthy value means the
// driver will call `update` instead with the older state
const _stateFn = Symbol("stateFn")

function setReused(component) {
  component[_stateFn] = null
  component[_generation]++
  for (const child of component.children) {
    setReused(child)
  }
}

export default class Driver {
  constructor(options) {
    this.Data = options.Data || Data
    this.ElementRequest = ElementRequest

    this._globals = options.globals || Data.create()
    this._cache = new Map()
    this._scheduled = new Set()
    this._raf = null
    this._updateScheduled = this._updateScheduled.bind(this)
  }

  // Internals:

  _createStateFn(component) {
    const {Data} = this
    const generation = component[_generation]

    return newState => {
      // because we reuse instances, and async functions can be called much
      // later, we need to guard against stale data
      if (component[_generation] !== generation) { return }
      newState = Data.create(newState)
      component[_state] = Data.merge(component[_state], newState)
      this._scheduled.add(component)
      this._schedule()
    }
  }

  _schedule() {
    if (!this._raf) {
      this._raf = window.requestAnimationFrame(this._updateScheduled)
    }
  }

  _updateScheduled() {
    for (const component of this._scheduled) {
      const {klass} = component

      const context = this.Data.merge(this._globals, component[_props], component[_state])

      klass.render(this, component, context)
    }
    this._scheduled.clear()
    window.cancelAnimationFrame(this._raf)
    this._raf = null
  }

  // Instance Management:

  create(klass) {
    const cache = this._cache.get(klass)
    let component
    if (cache && cache.length) {
      component = cache.pop()
    } else {
      component = klass.create(this)
      component.klass = klass
      component[_props] = null
      component[_state] = null
      component[_stateFn] = null
      component[_generation] = 0
      if (!component.children) { component.children = [] }
    }
    return component
  }

  update(component, props) {
    const {Data} = this
    const {klass} = component

    // create or update the context
    let state = null
    if (!component[_stateFn]) {
      // create the stateFn lazily only when needed
      const stateFn = component[_stateFn] = klass.init || klass.update
        ? this._createStateFn(component)
        : true
      if (klass.init) {
        state = Data.create(klass.init(Data, props, stateFn))
      }
    } else if (klass.update) {
      // in case of an update, also provide the old State
      const oldState = component[_state]
      const newState = klass.update(Data, props, oldState, component[_stateFn])
      state = Data.merge(oldState, Data.create(newState))
    }

    component[_props] = props
    component[_state] = state
    const context = Data.merge(this._globals, props, state)

    // and render
    klass.render(this, component, context)
    this._scheduled.delete(component)
  }

  reuse(component) {
    const {klass} = component
    const cache = this._cache

    setReused(component)

    if (!cache.has(klass)) {
      cache.set(klass, [component])
    } else {
      cache.get(klass).push(component)
    }
  }

  // DOM Manipulation:

  insert(component, parent, before) {
    const {klass} = component
    const elements = klass.getElements(component)
    for (const el of elements) {
      parent.insertBefore(el, before)
    }
  }

  remove(component) {
    const {klass} = component
    const elements = klass.getElements(component)
    for (const el of elements) {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }

  // Lifecycle Management:

  afterMount(component) {
    const {klass} = component
    if (klass.afterMount) {
      klass.afterMount(component)
    }

    for (const child of component.children) {
      this.afterMount(child)
    }
  }

  beforeUnmount(component) {
    const {klass} = component
    if (klass.beforeUnmount) {
      klass.beforeUnmount(component)
    }

    for (const child of component.children) {
      this.beforeUnmount(child)
    }
  }

  // Convenience:

  unmount(component) {
    this.beforeUnmount(component)
    this.remove(component)
    this.reuse(component)
  }
}
