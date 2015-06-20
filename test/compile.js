import {expect} from 'chai'

import {jsx, props, compile} from '../'

const div = document.createElement('div')
function innerHTML(node) {
  expect(node.ownerDocument).to.not.eql(document)
  div.textContent = ''
  div.appendChild(document.importNode(node, true))
  return div.innerHTML
}

describe('compiler', function () {
  it('should generate an importable node', function () {
    let {node} = compile(<div className="foo"/>)
    expect(innerHTML(node)).to.eql('<div class="foo"></div>')
  })
  it('should generate an importable node with nested children', function () {
    let {node} = compile(
      <div className="foo">
        <span className="bar">text</span>
        text
      </div>
    )
    expect(innerHTML(node)).to.eql('<div class="foo"><span class="bar">text</span>text</div>')
  })
  it('should create a function that sets dynamic props', function () {
    let {node, populate} = compile(
      <div className={props(p => p.klass)} />
    )
    populate(node, {klass: 'foo'})
    expect(innerHTML(node)).to.eql('<div class="foo"></div>')
    populate(node, {klass: 'bar'})
    expect(innerHTML(node)).to.eql('<div class="bar"></div>')
  })
  it('should create a function that sets dynamic text', function () {
    let {node, populate} = compile(props(p => p.text))
    populate(node, {text: 'foo'})
    expect(innerHTML(node)).to.eql('foo')
    populate(node, {text: 'bar'})
    expect(innerHTML(node)).to.eql('bar')
  })
  it('should create a function that sets dynamic props and text for nested elements', function () {
    let {node, populate} = compile(
      <div className={props(p => p.klass)}>
        <span className={props(p => p.klass)}>{props(p => p.text)}</span>
        {props(p => p.text)}
      </div>
    )
    populate(node, {text: 'foo', klass: 'foo'})
    expect(innerHTML(node)).to.eql('<div class="foo"><span class="foo">foo</span>foo</div>')
    populate(node, {text: 'bar', klass: 'bar'})
    expect(innerHTML(node)).to.eql('<div class="bar"><span class="bar">bar</span>bar</div>')
  });
})
