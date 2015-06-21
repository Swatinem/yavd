# yavd

[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Dependency Status][david-image]][david-url]

yavd started out as **y**et **a**nother **v**irtual **d**om library.

But it has actually grown into a code generator that generates code to mount,
update and unmount templates that are defined using a vdom structure.

yavd has two basic concepts:
* static templates
* dynamic fragments

*static templates* are pre-generated pieces of clonable html. It is either a
single node or a fragment of multiple nodes.
*dynamic fragments* are fragments that can dynamically change their contents
and have 0 or more nodes active at any given time. An `update` can create or
remove nodes from a fragment.

## API / Internals

```js

// public API:

yavd: {
  default: (VNode, Props?, Location?) => App

  props: ((Props, State) => Any) => VNodeProps,
  state: ((State) => Any) => VNodeProps,
  children: VnodeChildren,
  seq: ((Props, State) => Array<VNode>) => VNodeFragment,
  match: (
    (Props, State) => bool, (Props, State) => VNode,
    …
  ) => VNodeFragment,
}

App: {
  update: (Props) => void,
  unmount: () => void,
}

VNode: SimpleVNode | SpecialVNode

SimpleVNode: Number | String | {
  type: String | Component,
  props: Props,
  children: Array<VNode>,
  key?: String,
}

SpecialVNode: VNodeProps | VNodeChildren | VNodeFragment

Component: ComponentFn | ComponentObj

ComponentFn: () => VNode

ComponentObj: {
  template: () => VNode,
  initialState: (Props) => State,
  …
}

Location: Element | {
  parent: Element,
  before?: Element,
}

Props: Object
State: Object

// intertal API:
compile: (VNode) => NodeInstance

Data: {
  props: Props,
  state: State,
}

NodeInstance: {
  mount: (Location, Data) => void,
  unmount: (Location) => void,
  update: (Location, Data) => void,
}
```

[travis-image]: https://img.shields.io/travis/Swatinem/yavd.svg?style=flat-square
[travis-url]: https://travis-ci.org/Swatinem/yavd
[codecov-image]: https://img.shields.io/codecov/c/github/Swatinem/yavd.svg?style=flat-square
[codecov-url]: https://codecov.io/github/Swatinem/yavd
[david-image]: http://img.shields.io/david/Swatinem/yavd.svg?style=flat-square
[david-url]: https://david-dm.org/Swatinem/yavd
