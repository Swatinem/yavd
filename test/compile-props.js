import {matches} from "./helpers"
import {jsx, props, compile} from "../"

describe("compiler with dynamic props", function () {
  it("should create a function that sets dynamic props", function () {
    const {node, update} = compile(
      <div className={props(p => p.klass)} />
    )
    update(node, {klass: "foo"})
    matches(node, '<div class="foo"></div>')
    update(node, {klass: "bar"})
    matches(node, '<div class="bar"></div>')
  })
  it("should create a function that sets dynamic text", function () {
    const {node, update} = compile(props(p => p.text))
    update(node, {text: "foo"})
    matches(node, "foo")
    update(node, {text: "bar"})
    matches(node, "bar")
  })
  it("should create a function that sets dynamic props and text for nested elements", function () {
    const {node, update} = compile(
      <div className={props(p => p.klass)}>
        <span className={props(p => p.klass)}>{props(p => p.text)}</span>
        {props(p => p.text)}
        {" static text"}
      </div>
    )
    update(node, {text: "foo", klass: "foo"})
    matches(node, '<div class="foo"><span class="foo">foo</span>foo static text</div>')
    update(node, {text: "bar", klass: "bar"})
    matches(node, '<div class="bar"><span class="bar">bar</span>bar static text</div>')
  })
})
