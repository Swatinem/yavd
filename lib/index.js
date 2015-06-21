import App from "./app"
export {jsx, props, state, children} from "./jsx"

// XXX: just for now for the tests:
export {default as compile} from "./compile"

// given a template `vnode`, some initial `props` and an optional `location`
// to mount, this will create an app that can be `update`d with new `props` or
// unmounted.
export default function yavd(vnode, props = {}, location = document.body) {
  if ((props instanceof Node) || (props && (props.parent instanceof Node))) {
    location = props
    props = {}
  }
  // make sure location has always the same signature, also for hidden class
  // optimization
  if (location instanceof Node) {
    location = {parent: location, before: null}
  } else {
    location = {parent: location.parent, before: location.before}
  }
  return new App(vnode, props, location)
}
