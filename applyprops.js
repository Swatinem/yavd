export default function applyProps(obj, props) {
  for (let key in props) {
    let prop = props[key]
    if (prop && typeof prop === 'object') {
      applyProps(obj[key], prop)
    } else {
      obj[key] = prop
    }
  }
}
