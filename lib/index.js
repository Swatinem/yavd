export {default as jsx} from './jsx'
import create from './create'
import update from './update'
import {
  beforeMount,
  afterMount,
  beforeUnmount,
} from './instance'

export const _create = create
export const _update = update

export default function mount(vnode, parent) {
  let components = new Set()
  let elem = create(vnode, document, components)
  beforeMount(components)
  parent.appendChild(elem)
  afterMount(components)
  return function () {
    beforeUnmount(components)
    parent.removeChild(elem)
  }
}
