import {expect} from 'chai'
import {jsx, create, update} from '../'

const Component = {
  render({props}) {
    let first = props.first ? (<li>one fixed child</li>) : null
    if (props.other) {
      return (
        <footer></footer>
      )
    }
    return (
      <header className={props.bar ? 'bar' : 'foo'}>
        <ul>
          {first}
          {props.children}
        </ul>
      </header>
    )
  }
}

describe('full components', function () {
  it('should create a subtree', function () {
    let node
    node = create(<Component first={true} bar={false}><li>second child</li></Component>)
    expect(node.outerHTML).to.eql('<header class="foo"><ul><li>one fixed child</li><li>second child</li></ul></header>')
    node = create(<Component first={false} bar={true}>{0}</Component>)
    expect(node.outerHTML).to.eql('<header class="bar"><ul>0</ul></header>')
  })
  it('should update with new props', function () {
    let prev = (<Component first={true} bar={false}><li>second child</li></Component>)
    let next = (<Component first={false} bar={true}>{0}</Component>)
    let node = create(prev)
    update(node, prev, next)
    expect(node.outerHTML).to.eql('<header class="bar"><ul>0</ul></header>')
  })
  it('should support replacing the root node', function () {
    let prev = (<div><Component first={true} bar={false}><li>second child</li></Component></div>)
    let next = (<div><Component other={true}></Component></div>)
    let node = create(prev)
    update(node, prev, next)
    expect(node.innerHTML).to.eql('<footer></footer>')
  })
})
