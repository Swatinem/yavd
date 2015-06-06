import {Instance, render} from './instance'

const propMap = {
  className: 'class',
}

export default function stringify(vnode) {
  if (typeof vnode !== 'object') {
    return String(vnode)
  }

  if (typeof vnode.type === 'string') {
    let str = '<' + vnode.type
    for (let key in vnode.props) {
      if (key === 'children') { continue }
      let value = vnode.props[key]
      if (key === 'dataset') {
        for (let k in value) {
          str += ` data-${dashize(k)}="${clean(value[k])}"`
        }
        continue
      }
      let attr = propMap[key] || key
      if (key === 'style') {
        value = Object.keys(value).map(prop => `${dashize(prop)}: ${value[prop]}`).join('; ')
      }
      str += ` ${attr}="${clean(value)}"`
    }
    // TODO: supporting self-closing tags via a white/black listing would be nice
    str += '>'
    str += vnode.props.children.map(child => stringify(child)).join('')
    str += `</${vnode.type}>`
    return str
  }

  let instance = Instance(vnode)
  return stringify(render(instance))
}

function clean(str) {
  return String(str).replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;').replace('"', '&quot;')
}

//function camelize(str) {
//  return str.replace(/\-[a-z]/g, function () { console.log(arguments) })
//}

function dashize(str) {
  return str.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
}
