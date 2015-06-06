import {expect} from 'chai'
import {jsx} from '../'
import stringify from '../stringify'

const Component = function ({props}) {
  return (<div id={props.foo}></div>)
}

describe('stringify', function () {
  it('should render a few nested elements', function () {
    let node = (<ul><li>a</li><li>b</li></ul>)
    let str = stringify(node, false)
    expect(str).to.eql('<ul><li>a</li><li>b</li></ul>')
  })
  it('should render attrs', function () {
    let node = (<div id="bar" className="foo"></div>)
    let str = stringify(node)
    expect(str).to.eql('<div id="bar" class="foo"></div>')
  })
  it('should render components', function () {
    let node = (<Component foo="bar"></Component>)
    let str = stringify(node)
    expect(str).to.eql('<div id="bar"></div>')
  })
  it('should render styles', function () {
    let node = (<div style={{marginTop: '1px'}}></div>)
    let str = stringify(node)
    expect(str).to.eql('<div style="margin-top: 1px"></div>')
  })
  it('should render dataset', function () {
    let node = (<div dataset={{fooBar: 'foo'}}></div>)
    let str = stringify(node)
    expect(str).to.eql('<div data-foo-bar="foo"></div>')
  })
})
