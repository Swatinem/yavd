import {matches} from "./helpers"
import {jsx, props, compile} from "../"

describe("compiler with dynamic props", function () {
  it("should create a function that sets dynamic props", function () {
    const {node, populate} = compile(
      <div className={props(p => p.klass)} />
    )
    populate(node, {klass: "foo"})
    matches(node, '<div class="foo"></div>')
    populate(node, {klass: "bar"})
    matches(node, '<div class="bar"></div>')
  })
  it("should create a function that sets dynamic text", function () {
    const {node, populate} = compile(props(p => p.text))
    populate(node, {text: "foo"})
    matches(node, "foo")
    populate(node, {text: "bar"})
    matches(node, "bar")
  })
  it("should create a function that sets dynamic props and text for nested elements", function () {
    const {node, populate} = compile(
      <div className={props(p => p.klass)}>
        <span className={props(p => p.klass)}>{props(p => p.text)}</span>
        {props(p => p.text)}
        {" static text"}
      </div>
    )
    populate(node, {text: "foo", klass: "foo"})
    matches(node, '<div class="foo"><span class="foo">foo</span>foo static text</div>')
    populate(node, {text: "bar", klass: "bar"})
    matches(node, '<div class="bar"><span class="bar">bar</span>bar static text</div>')
  })
})
