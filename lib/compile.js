import Codegen from "./codegen"
import Compiler from "./compiler"

export default function compile(vnode, options = {}) {
  const codegen = new Codegen()
  const compiler = new Compiler(codegen, options)
  const node = compiler.vnode(vnode)
  return {node, populate: codegen.populateFn(), remove: codegen.removeFn()}
}
