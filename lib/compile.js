import Compiler from "./compiler"

export default function compile(vnode) {
  const compiler = new Compiler(vnode)
  const {template, mount, update, unmount} = compiler.finish()
  // TODO: cache and reuse instances
  const instance = {
    template,
    mount, // TODO: reuse
    update,
    unmount, // TODO: reuse
  }
  return instance
}
