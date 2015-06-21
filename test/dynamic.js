import {expect} from "chai"
import {jsx, props, yavd} from "../"

describe("tags with dynamic content props", function () {
  const parent = document.createElement("div")
  let app
  afterEach(function () {
    app.unmount()
    expect(parent.firstChild).to.eql(null)
  })

  it("should mount and update a node with dynamic props", function () {
    app = yavd(
      <div className={props(p => p.klass)} />,
      {klass: "foo"},
      parent)
    expect(parent.innerHTML).to.eql('<div class="foo"></div>')
    app.update({klass: "bar"})
    expect(parent.innerHTML).to.eql('<div class="bar"></div>')
  })
  it("should mount and update a dynamic TextNode", function () {
    app = yavd(
      props(p => p.text),
      {text: "foo"},
      parent)
    expect(parent.innerHTML).to.eql("foo")
    app.update({text: "bar"})
    expect(parent.innerHTML).to.eql("bar")
  })
  it("should mount and update a nested node with dynamic props and dynamic TextNodes", function () {
    app = yavd(
      <div className={props(p => p.klass)}>
        <span className={props(p => p.klass)}>{props(p => p.text)}</span>
        {props(p => p.text)}
        {" static text"}
      </div>,
      {text: "foo", klass: "foo"},
      parent)
    expect(parent.innerHTML).to.eql('<div class="foo"><span class="foo">foo</span>foo static text</div>')
    app.update({text: "bar", klass: "bar"})
    expect(parent.innerHTML).to.eql('<div class="bar"><span class="bar">bar</span>bar static text</div>')
  })
})
