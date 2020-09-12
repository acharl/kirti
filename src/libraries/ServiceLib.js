const OrbitDBSingleton = require("./OrbitDBSingle")
const serviceToSolidityObject = require("../app/helpers/typeConversion")
const Web3 = require("web3")
var web3 = new Web3("ws://localhost:9545")
const kirti = require("../../build/contracts/Kirti.json")
const contract = new web3.eth.Contract(
  kirti.abi,
  kirti.networks["5777"].address
)

class ServiceLib {
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

    this.servicesDb = await this.orbitdb.docstore("services", docStoreOptions)
    this.ratingsKeyValueDb = await orbitdb.keyvalue("ratings", defaultOptions)

    await this.loadDb()
    await this.loadKeyValDb()
  }

  async loadDb() {
    return await this.servicesDb.load()
  }

  async loadKeyValDb() {
    return await this.ratingsKeyValueDb.load()
  }

  async addNewService(newService, providerAddress) {
    await this.init()
    const uniqueId = newService.serviceName
    const existingService = this.servicesDb.get(uniqueId)
    if (existingService.length > 0) {
      return Promise.reject(
        new Error(`A service named ${uniqueId} has already been added!`)
      )
    }
    const solidityObj = serviceToSolidityObject(newService)
    const registrationHash = await this.fetchTxHashFromRegistration(
      solidityObj,
      providerAddress
    )

    newService.registrationHash = registrationHash
    const dbName = `ratings-${uniqueId}`
    const ratingDb = await this.orbitdb.eventlog(dbName, this.defaultOptions)
    const ratingDbAddress = ratingDb.address.toString()

    newService.ratingDb = ratingDbAddress
    await this.writeToKeyValDb(newService.serviceName, ratingDbAddress)
    await this.writeToDb(uniqueId, newService)
    await this.loadDb()
    await this.loadKeyValDb()
    return registrationHash
  }

  getAllCustomers() {
    const allCustomers = this.customersDb.get("")
    return allCustomers
  }

  async writeToDb(uniqueId, newService) {
    const cid = await this.servicesDb.put({
      name: uniqueId,
      service: newService,
    })
    return cid
  }

  async writeToKeyValDb(name, ratingDbAddress) {
    const cid = await this.ratingsKeyValueDb.put(name, ratingDbAddress)
    console.log("writeToKeyValDb", cid, name, ratingDbAddress)
    return cid
  }

  async fetchTxHashFromRegistration(newService) {
    const accounts = await web3.eth.getAccounts()
    return new Promise((resolve) => {
      contract.methods
        .registerService(newService)
        .send({ from: accounts[0], gas: 3000000 })
        .then(async (tx) => {
          resolve(tx.transactionHash)
        })
        .catch((err) => console.error("ERROR", err))
    })
  }

  getServiceByName(hash) {
    const singleService = this.servicesDb.get(hash)[0]
    return singleService
  }

  async getRatingsDbOfService(name) {
    await this.ratingsKeyValueDb.load()
    const dbAddress = this.ratingsKeyValueDb.get(name)

    return dbAddress
  }

  getAllServices() {
    const allServices = this.servicesDb.get("")
    return allServices
  }
}

module.exports = ServiceLib
