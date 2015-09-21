const Data = {
  create(initial) {
    return initial || Object.create(null)
  },
  get(key, obj) { return obj[key] },
  merge(...args) { return Object.assign(...args) },
  equals(a, b) { return a === b },
}

export default Data
