import {expect} from 'chai'
import {jsx, _create as create, _update as update} from '../'

const cases = [
  <div></div>,
  <div className="foobar"></div>,
  <div id="foobar"></div>,
  <div dataset={{foo: 'bar', bar: 'foo'}}></div>,
  <div dataset={{foo: 'bar'}} style={{position: 'fixed', display: 'none', cursor: 'pointer'}}></div>,
  <div style={{position: 'fixed', display: 'inline'}}></div>,
  <div foo="bar"></div>,
  <div></div>,
]

describe('reconcile', function () {
  let prev = cases[0]
  let node = create(prev)
  describe('should update the dom tree perfectly', function () {
    for (let i = 1, len = cases.length; i < len; i++) {
      it('should work for case ' + i, function () {
        let next = cases[i]
        let expected = create(next)
        update(node, prev, next)
        // XXX: WTF is wrong with phantomjs?!? some node.attributes values are
        // not in sync with the actual value? WTF really?
        for (let i = 0, len = node.attributes.length; i < len; i++) {
          let attr = node.attributes[i]
          attr.textContent = attr.value
          if (attr.firstChild) {
            attr.firstChild.data = attr.value
          }
        }
        expect(node).to.eql(expected)
        prev = next
      })
    }
  })
})
