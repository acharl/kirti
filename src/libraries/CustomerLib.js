const OrbitDBSingleton = require("./OrbitDBSingle")

class CustomerLib {
  constructor() {}

  async init() {
    const singleton = new OrbitDBSingleton()
    this.orbitdb = await singleton.getInstance()

    const defaultOptions = {
      accessController: { write: [this.orbitdb.identity.id] },
    }
    const customerStoreOptions = {
      ...defaultOptions,
      indexBy: "address",
    }

    this.customersDb = await this.orbitdb.docstore(
      "customers1",
      customerStoreOptions
    )

    await this.loadDb()
    return { orbitdb: this.orbitdb, customersDb: this.customersDb }
  }

  async loadDb() {
    return this.customersDb.load()
  }

  async addServiceForCustomer(customerAddress, service) {
    await this.init()
    const uniqueId = customerAddress
    const existingCustomer = this.customersDb.get(uniqueId)
    if (
      existingCustomer.length > 0 &&
      existingCustomer[0].services.length > 0
    ) {
      let services = existingCustomer[0].services
      services.push(service)
      return this.addServiceExistingCustomer(customerAddress, services)
    } else {
      return this.addServiceNewCustomer(customerAddress, service)
    }
  }

  deleteCustomer(address) {
    this.customersDb.del(address)
  }

  async addServiceExistingCustomer(uniqueId, services) {
    const cid = await this.customersDb.put({
      address: uniqueId,
      services: services,
    })
    return cid
  }

  async addServiceNewCustomer(uniqueId, newService) {
    const cid = await this.customersDb.put({
      address: uniqueId,
      services: [newService],
    })
    return cid
  }

  getCustomerByAddress(address) {
    const singleCustomer = this.customersDb.get(address)[0]
    return singleCustomer
  }

  getAllCustomers() {
    const allCustomers = this.customersDb.get("")
    return allCustomers
  }
}

module.exports = CustomerLib
