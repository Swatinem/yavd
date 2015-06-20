import {matches} from "./helpers"
import {jsx, compile} from "../"

describe("compiler with static tags", function () {
  it("should generate an importable node", function () {
    const {node} = compile(<div className="foo"/>)
    matches(node, '<div class="foo"></div>')
  })
  it("should generate an importable node with nested children", function () {
    const {node} = compile(
      <div className="foo">
        <span className="bar">text</span>
        text
      </div>
    )
    matches(node, '<div class="foo"><span class="bar">text</span>text</div>')
  })
})
