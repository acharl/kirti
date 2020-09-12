const OrbitDBSingleton = require("./OrbitDBSingle")

const Web3 = require("web3")
var web3 = new Web3("ws://localhost:9545")
const kirti = require("../../build/contracts/Kirti.json")
const contract = new web3.eth.Contract(
  kirti.abi,
  kirti.networks["5777"].address
)
class MonitorLib {
  constructor() {}

  async init() {
    const singleton = new OrbitDBSingleton()
    this.orbitdb = await singleton.getInstance()

    const defaultOptions = {
      accessController: { write: [this.orbitdb.identity.id] },
    }
    const docStoreOptions = {
      ...defaultOptions,
      indexBy: "name",
    }

    this.monitorsDb = await this.orbitdb.docstore(
      "monitors0223024234901",
      docStoreOptions
    )

    this.uniqueAddressesDb = await this.orbitdb.keyvalue(
      "uniqueAddresses0223024234901",
      defaultOptions
    )
    await this.loadDb()
  }

  async loadDb() {
    await this.monitorsDb.load()
    await this.uniqueAddressesDb.load()
    return
  }

  async addNewMonitor(name, address) {
    await this.init()
    const existingName = this.monitorsDb.get(name)
    const existingAddress = this.uniqueAddressesDb.get(address)
    if (existingName.length > 0) {
      return Promise.reject(
        new Error(`A monitor named ${name} has already been added!`)
      )
    }
    if (existingAddress) {
      return Promise.reject(
        new Error(`A monitor with address ${address} has already been added!`)
      )
    }

    const registrationHash = await this.fetchTxHashFromRegistration(
      name,
      address
    )
    await this.writeToDb(name, address, registrationHash)
    await this.loadDb()
    return registrationHash
  }

  async writeToDb(name, address, registrationHash) {
    const cid = await this.monitorsDb.put({
      name: name,
      address: address,
      registrationHash: registrationHash,
    })
    await this.uniqueAddressesDb.put(address, true)
    return cid
  }

  async fetchTxHashFromRegistration(name, address) {
    const accounts = await web3.eth.getAccounts()
    return new Promise((resolve) => {
      contract.methods
        .registerMonitor([name, address])
        .send({ from: accounts[0], gas: 3000000 })
        .then(async (tx) => {
          resolve(tx.transactionHash)
        })
        .catch((err) => console.error("ERROR", err))
    })
  }

  getAllMonitors() {
    const allCustomers = this.monitorsDb.get("")
    return allCustomers
  }
}

module.exports = MonitorLib
