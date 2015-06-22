import {expect} from "chai"
import {jsx, props, yavd} from "../"

describe("simple components", function () {
  const parent = document.createElement("div")
  let app
  afterEach(function () {
    app.unmount()
    expect(parent.firstChild).to.eql(null)
  })

  it("should render a completely static component", function () {
    const Component = <div className="foo">bar</div>
    app = yavd(
      <Component />,
      parent)
    expect(parent.innerHTML).to.eql('<div class="foo">bar</div>')
  })

  it("should render a component and pass through props", function () {
    const Component = (
      <div className={props(p => p.Cklass)}>
        <span className={props(p => p.Cklass)}>{props(p => p.Ctext)}</span>
        {props(p => p.Ctext)}
        {" static text"}
      </div>)
    app = yavd(
      <Component Cklass={props(p => p.klass)} Ctext={props(p => p.text)} />,
      {text: "foo", klass: "foo"},
      parent)
    expect(parent.innerHTML).to.eql('<div class="foo"><span class="foo">foo</span>foo static text</div>')
    app.update({text: "bar", klass: "bar"})
    expect(parent.innerHTML).to.eql('<div class="bar"><span class="bar">bar</span>bar static text</div>')
  })

  it("should render nested components with statically defined props", function () {
    const Item = <li>{props(p => p.text)}</li>
    app = yavd(
      <ul>
        <Item text="first" />
        <Item text="second" />
      </ul>,
      parent)
    expect(parent.innerHTML).to.eql("<ul><li>first</li><li>second</li></ul>")
  })
})
