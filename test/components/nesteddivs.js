import SingleDiv from "./singlediv.js"

export default {
  create(driver) {
    const el = document.createElement("div")
    el.appendChild(document.createTextNode(""))
    const children = [
      driver.create(SingleDiv, driver),
      driver.create(SingleDiv, driver),
    ]
    return {
      el,
      children,
    }
  },

  render(driver, component, context) {
    const [a, c] = component.children

    driver.update(a, driver.Data.create({text: driver.Data.get("a", context)}))
    component.el.firstChild.data = driver.Data.get("b", context)
    driver.update(c, driver.Data.create({text: driver.Data.get("c", context)}))
  },

  getElements(component) {
    const [a, c] = component.children
    return [
      ...a.klass.getElements(a),
      component.el,
      ...c.klass.getElements(c),
    ]
  },
}
