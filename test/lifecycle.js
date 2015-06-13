import {expect} from 'chai'
import {jsx, default as mount, _create as create} from '../'

let calls = 0
const Component = {
  render({props}) {
    let children = []
    for (let i = 0; i < props.num; i++) {
      children.push(<Child num={i}></Child>)
    }

    return (<div id="container">{children}</div>)
  },
  beforeMount() { calls++ },
}
const Child = {
  render({props}) {
    return (
      <div class="child">{props.num}</div>
    )
  },
  beforeMount() { calls++ },
}

describe('lifecycle', function () {
  let unmount
  let parent = create(<div></div>)
  afterEach(function () {
    calls = 0
    unmount()
  })
  it('should call `beforeMount` before mounting a component and its children', function () {
    unmount = mount(<Component num={1}></Component>, parent)
    expect(calls).to.eql(2)
  })
  it.skip('should call `beforeMount` before adding a new Child', function () {
    unmount = mount(<Component num={1}></Component>, parent)
    calls = 0
  })
})
