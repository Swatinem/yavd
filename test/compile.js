import {matches} from './helpers'
import {jsx, props, compile} from '../'

describe('compiler with static tags', function () {
  it('should generate an importable node', function () {
    let {node} = compile(<div className="foo"/>)
    matches(node, '<div class="foo"></div>')
  })
  it('should generate an importable node with nested children', function () {
    let {node} = compile(
      <div className="foo">
        <span className="bar">text</span>
        text
      </div>
    )
    matches(node, '<div class="foo"><span class="bar">text</span>text</div>')
  })
})
