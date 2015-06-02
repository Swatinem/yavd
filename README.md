# yavd

yavd is **y**et **a**nother **v**irtual **d**om library.

The goals are to be lightweight and very simple, and I do mean it! But it
should also have some advanced optimizations

I would like to explore some ideas I have to make vdom really nice to use, and
also fast. Because whatever you might have heard. The various virtual dom
libraries out there are *not* fast.

* yavd is very modular. You only pay for what you really want to use.
* yavd is written in ES6. So it means it is ready for our next generation
  browsers. It also means you need to transpile it yourself if you want to use
  it!

## Internals

*yavd* will work with plain js objects internally, with no expensive
constructor function.
I plan to use things like html5 templates to help cloning entire subtrees and
also to reuse previous component instances.

```js
Node: String | {
  type: Component,
  props: Props,
  key?: String
}

Component: String | ComponentFn | ComponentObj

ComponentFn: (Instance) => Node

ComponentObj: {
  render: (Instance) => Node,
  …
}

Props: {
  children: Array<Node>,
  …
}

Instance: {
  props: Props,
  state: Object,
}
```
