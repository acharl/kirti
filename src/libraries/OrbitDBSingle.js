const IPFS = require("ipfs")
const OrbitDB = require("orbit-db")
class OrbitDBSingleton {
  constructor() {}

  async getInstance() {
    if (!global.orbitdb) {
      const node = await IPFS.create()
      const orbitdb = await OrbitDB.createInstance(node)
      global.orbitdb = orbitdb
    }

    return global.orbitdb
  }
}
module.exports = OrbitDBSingleton
