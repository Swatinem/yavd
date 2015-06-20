import {expect} from 'chai'

import {jsx} from '../'

describe('jsx constructor', function () {
  it('should create an empty node', function () {
    let node = {
      type: 'div',
      props: {},
      children: [],
    }
    expect(<div/>).to.eql(node)
  })
  it('should create a node with props', function () {
    let node = {
      type: 'div',
      props: {className: 'foo'},
      children: [],
    }
    expect(<div className="foo"/>).to.eql(node)
  })
  it('should add children', function () {
    let node = {
      type: 'div',
      props: {id: 'bar'},
      children: [
        'some text ',
        {
          type: 'em',
          props: {},
          children: ['and']
        },
        ' ',
        {
          type: 'span',
          props: {className: 'foo'},
          children: ['other'],
        },
      ],
    }
    expect(<div id="bar">some text <em>and</em> <span className="foo">other</span></div>).to.eql(node)
  })
})
