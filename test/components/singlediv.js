export default {
  create() {
    const el = document.createElement("div")
    el.appendChild(document.createTextNode(""))
    return {
      el,
    }
  },

  render(driver, component, context) {
    component.el.firstChild.data = driver.Data.get("text", context)
  },

  getElements(component) {
    return [component.el]
  },
}
