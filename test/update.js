import {expect} from 'chai'
import {jsx, _create as create, _update as update} from '../'

describe('update', function () {
  it('should update a dom node', function () {
    let prev = (<div>foo</div>)
    let node = create(prev)
    let next = (<div id="bar">some text <em>and</em> <span className="foo">other</span></div>)
    update(node, prev, next)
    expect(node.outerHTML).to.eql('<div id="bar">some text <em>and</em> <span class="foo">other</span></div>')
  })
  it('should replace a node', function () {
    let parent = create(<div />)
    let prev = (<div />)
    let node = create(prev)
    parent.appendChild(node)
    let next = (<header />)
    expect(parent.innerHTML).to.eql('<div></div>')
    update(node, prev, next)
    // XXX: just for coverages sake
    update(node, next, next)
    expect(parent.innerHTML).to.eql('<header></header>')
  })
})
