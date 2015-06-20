export function jsx(type, props, ...children) {
  return {type, props: props || {}, children}
}

export function props(fn) {
  return {
    type: props,
    props: fn,
    children: null, // just for hidden class optimization
  }
}

export function state(fn) {
  return {
    type: props,
    props: (_, s) => fn(s),
    children: null,
  }
}

export function children() {
  return {
    type: children,
    props: null,
    children: null,
  }
}
