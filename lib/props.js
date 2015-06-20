export default function apply(node, key, value) {
  switch (key) {
    case "style":
      style(node, value)
      break
    case "dataset":
      dataset(node, value)
      break
    default:
      node[key] = value
  }
}

function style(node, value) {
  // TODO
}
function dataset(node, value) {
  // TODO
}
