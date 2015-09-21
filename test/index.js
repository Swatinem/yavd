import {expect} from "chai"
import SingleDiv from "./components/singlediv.js"
import NestedDiv from "./components/nesteddivs.js"
import {start} from "../"

let instance
const parent = document.createElement("div")
document.body.appendChild(parent)
afterEach(() => {
  instance.unmount()
})

describe("Simple div", () => {
  it("should mount and unmount", () => {
    instance = start({}, SingleDiv, {text: "test"}, parent)
    expect(parent.innerHTML).to.equal("<div>test</div>")
    instance.unmount()
    expect(parent.innerHTML).to.equal("")
  })

  it("should be mounted before the given element", () => {
    const before = parent.appendChild(document.createElement("div"))
    instance = start({}, SingleDiv, {text: "test"}, parent, before)
    expect(parent.innerHTML).to.equal("<div>test</div><div></div>")
    instance.unmount()
    expect(parent.innerHTML).to.equal("<div></div>")
    parent.removeChild(before)
  })

  it("should update the dom when passing new props", () => {
    instance = start({}, SingleDiv, {text: "foo"}, parent)
    expect(parent.innerHTML).to.equal("<div>foo</div>")
    instance.update({text: "bar"})
    expect(parent.innerHTML).to.equal("<div>bar</div>")
  })

  it("should call the `afterMount` and `beforeUnmount` lifecycle functions", () => {
    let afterMount = 0
    let beforeUnmount = 0
    const Div = Object.assign({}, SingleDiv, {
      afterMount(component) {
        expect(component.el).to.equal(parent.firstChild)
        afterMount++
      },
      beforeUnmount() {
        beforeUnmount++
      },
    })
    instance = start({}, Div, {text: "test"}, parent)
    expect(afterMount).to.equal(1)
    instance.unmount()
    expect(beforeUnmount).to.equal(1)
  })
})

describe("Nested div", () => {
  it("should mount and unmount", () => {
    instance = start({}, NestedDiv, {a: "a", b: "b", c: "c"}, parent)
    expect(parent.innerHTML).to.equal("<div>a</div><div>b</div><div>c</div>")
    instance.unmount()
    expect(parent.innerHTML).to.equal("")
  })

  it("should be mounted before the given element", () => {
    const before = parent.appendChild(document.createElement("div"))
    instance = start({}, NestedDiv, {a: "a", b: "b", c: "c"}, parent, before)
    expect(parent.innerHTML).to.equal("<div>a</div><div>b</div><div>c</div><div></div>")
    instance.unmount()
    expect(parent.innerHTML).to.equal("<div></div>")
    parent.removeChild(before)
  })

  it("should update the dom when passing new props", () => {
    instance = start({}, NestedDiv, {a: "a", b: "b", c: "c"}, parent)
    expect(parent.innerHTML).to.equal("<div>a</div><div>b</div><div>c</div>")
    instance.update({a: 1, b: 2, c: 3})
    expect(parent.innerHTML).to.equal("<div>1</div><div>2</div><div>3</div>")
  })

  it("should call the `afterMount` and `beforeUnmount` lifecycle functions", () => {
    let afterMount = 0
    let beforeUnmount = 0
    const Div = Object.assign({}, NestedDiv, {
      afterMount(component) {
        expect(component.el).to.equal(parent.firstChild.nextSibling)
        afterMount++
      },
      beforeUnmount() {
        beforeUnmount++
      },
    })
    instance = start({}, Div, {a: 1, b: 2, c: 3}, parent)
    expect(afterMount).to.equal(1)
    instance.unmount()
    expect(beforeUnmount).to.equal(1)
  })

  it("should support the init/update hooks to set state", () => {
    let init = 0
    let update = 0
    const Div = Object.assign({}, NestedDiv, {
      init(Data, props) {
        const num = Data.get("num", props)
        init++
        return {a: num, b: num + 1, c: num + 2}
      },
      update(Data, props) {
        const num = Data.get("num", props)
        update++
        return {a: num, b: num + 1, c: num + 2}
      },
    })
    instance = start({}, Div, {num: 0}, parent)
    expect(parent.innerHTML).to.equal("<div>0</div><div>1</div><div>2</div>")
    expect(init).to.equal(1)
    expect(update).to.equal(0)
    instance.update({num: 1})
    expect(parent.innerHTML).to.equal("<div>1</div><div>2</div><div>3</div>")
    expect(init).to.equal(1)
    expect(update).to.equal(1)
  })

  it("should support async state changes", done => {
    const Div = Object.assign({}, NestedDiv, {
      init(Data, props, setState) {
        const num = Data.get("num", props)
        setTimeout(() => setState({a: num + 1, b: num + 2, c: num + 3}), 0)
        return {a: num, b: num + 1, c: num + 2}
      },
    })
    instance = start({}, Div, {num: 0}, parent)
    expect(parent.innerHTML).to.equal("<div>0</div><div>1</div><div>2</div>")
    setTimeout(() => {
      expect(parent.innerHTML).to.equal("<div>1</div><div>2</div><div>3</div>")
      done()
    }, 100)
  })

  it("should guard against stale data from async state changes", done => {
    let el
    const Div = Object.assign({}, NestedDiv, {
      init(Data, props, setState) {
        const num = Data.get("num", props)
        setTimeout(() => setState({a: num + 1, b: num + 2, c: num + 3}), 0)
        return {a: num, b: num + 1, c: num + 2}
      },
      afterMount(component) {
        // el is the middle element
        el = component.el
      },
    })
    instance = start({}, Div, {num: 0}, parent)
    expect(parent.innerHTML).to.equal("<div>0</div><div>1</div><div>2</div>")
    instance.unmount()
    setTimeout(() => {
      expect(el.outerHTML).to.equal("<div>1</div>")
      done()
    }, 100)
  })
})
