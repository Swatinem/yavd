import {expect} from 'chai'
import {jsx, create} from '../'

describe('create', function () {
  it('should render a simple dom tree', function () {
    let node = create(<div/>)
    expect(node.outerHTML).to.eql('<div></div>');
  })
  it('should render a bit more complex dom tree', function () {
    let node = create(<div id="bar">some text <em>and</em> <span className="foo">other</span></div>)
    expect(node.outerHTML).to.eql('<div id="bar">some text <em>and</em> <span class="foo">other</span></div>');
  })
  it('should deal with style and dataset', function () {
    let node = create(<div style={{margin: 'auto'}} />)
    expect(node.outerHTML).to.eql('<div style="margin: auto;"></div>')
    node = create(<div dataset={{foo: 'bar'}} />)
    expect(node.outerHTML).to.eql('<div data-foo="bar"></div>')
  });
})
