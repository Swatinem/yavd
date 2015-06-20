import {expect} from 'chai'
const div = document.createElement('div')
export function innerHTML(node) {
  expect(node.ownerDocument).to.not.eql(document)
  div.textContent = ''
  div.appendChild(document.importNode(node, true))
  return div.innerHTML
}

export function matches(node, str) {
  expect(innerHTML(node)).to.eql(str)
}
