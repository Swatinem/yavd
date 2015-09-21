import Driver from "./driver.js"

class DriverPublic {
  constructor(options, klass, props, parent, before = null) {
    const driver = this.driver = new Driver(options)
    const root = this.root = driver.create(klass)

    driver.update(root, props)
    driver.insert(root, parent, before)
    driver.afterMount(root)

    this.update = this.update.bind(this)
    this.unmount = this.unmount.bind(this)
  }

  update(props) {
    const {driver, root} = this
    driver.update(root, props)
  }

  unmount() {
    const {driver, root} = this
    driver.unmount(root)
  }
}

export function start(...args) {
  return new DriverPublic(...args)
}
