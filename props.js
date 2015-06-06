export default function apply(node, prev, next) {
  // apply new or changed props
  for (let key in next) {
    if (key === 'children' || prev[key] === next[key]) { continue }
    switch (key) {
      case 'style':
        style(node, prev.style || {}, next.style)
        break
      case 'dataset':
        dataset(node, prev.dataset || {}, next.dataset)
        break
      default:
        node[key] = next[key]
    }
  }
  // deal with removed props
  for (let key in prev) {
    if (key in next) { continue }
    switch (key) {
      case 'dataset':
        dataset(node, prev.dataset)
        break
      case 'className':
        key = 'class'
        // falls through
      case 'style':
      case 'id':
        node.removeAttribute(key)
        break
      default:
        try {
          node[key] = undefined
          delete node[key]
        } catch (e) {}
    }
  }
}

// TODO: vendor prefix stuff?
function style(node, prev, next) {
  for (let key in next) {
    if (next[key] !== prev[key]) {
      node.style[key] = next[key]
    }
  }
  for (let key in prev) {
    if (key in next) { continue }
    node.style[key] = ''
  }
}

function dataset(node, prev, next = {}) {
  for (let key in next) {
    if (next[key] !== prev[key]) {
      node.dataset[key] = next[key]
    }
  }
  for (let key in prev) {
    if (key in next) { continue }
    delete node.dataset[key]
  }
}
