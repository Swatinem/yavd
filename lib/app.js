import compile from "./compile"

export default class App {
  constructor(vnode, props, location) {
    this.location = location
    // TODO: do initialState from vnode component
    this.data = {
      props,
      state: {},
    }
    this.instance = compile(vnode)
    this.instance.mount(location, this.data)
  }
  unmount() {
    this.instance.unmount(this.location)
  }
  update(props) {
    this.instance.update(this.location, this.data)
  }
}
