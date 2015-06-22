import {expect} from "chai"
import {jsx, yavd} from "../"

describe("static tags", function () {
  const parent = document.createElement("div")
  afterEach(function () {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  })

  it("should mount a static tag", function () {
    yavd(<div className="foo"/>, parent)
    expect(parent.innerHTML).to.eql('<div class="foo"></div>')
  })

  it("should mount to document.body by default", function () {
    yavd(<div className="foo"/>)
    expect(document.body.lastChild.outerHTML).to.eql('<div class="foo"></div>')
    document.body.removeChild(document.body.lastChild)
  })

  it("should mount a static tag with nested children", function () {
    yavd(
      <div className="foo">
        <span className="bar">text</span>
        text
      </div>,
      parent)
    expect(parent.innerHTML).to.eql('<div class="foo"><span class="bar">text</span>text</div>')
  })

  it("should unmount a static tag from its parent", function () {
    const app = yavd(<div className="foo"/>, parent)
    expect(parent.innerHTML).to.eql('<div class="foo"></div>')
    app.unmount()
    expect(parent.firstChild).to.eql(null)
  })

  it("should mount the tag before the specified one", function () {
    parent.appendChild(document.createTextNode("foo"))
    parent.appendChild(document.createTextNode("bar"))
    const app = yavd(
      <div className="foo"/>,
      {parent, before: parent.lastChild})
    expect(parent.innerHTML).to.eql('foo<div class="foo"></div>bar')
    app.unmount()
    expect(parent.innerHTML).to.eql("foobar")
  })
})
