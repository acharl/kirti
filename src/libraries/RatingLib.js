const OrbitDBSingleton = require("./OrbitDBSingle")

const Web3 = require("web3")
var web3 = new Web3("ws://localhost:9545")
const kirti = require("../../build/contracts/Kirti.json")
const contract = new web3.eth.Contract(
  kirti.abi,
  kirti.networks["5777"].address
)

class RatingLib {
  constructor() {}

  async init(dbAddress) {
    const singleton = new OrbitDBSingleton()
    this.orbitdb = await singleton.getInstance()

    const defaultOptions = {
      accessController: { write: [this.orbitdb.identity.id] },
    }
    const options = {
      defaultOptions,
      indexBy: "customer",
    }
    this.singleServiceRatingDb = await this.orbitdb.eventlog(dbAddress, options)
  }

  async addRatingForService(rating) {
    const registrationHash = await this.fetchTxHashFromRegistration([
      rating.customerAddress,
      rating.serviceName,
      [
        rating.ratingScore.accurracy,
        rating.ratingScore.usability,
        rating.ratingScore.pricing,
        rating.ratingScore.support,
        rating.ratingScore.features,
        rating.ratingScore.ratingText,
      ],
    ])
    rating.registrationHash = registrationHash
    await this.writeToDb(rating.customerAddress, rating)
    await this.loadDb()
    return registrationHash
  }

  async loadDb() {
    return this.singleServiceRatingDb.load()
  }

  async writeToDb(customerAddress, rating) {
    const cid = await this.singleServiceRatingDb.add({
      customer: customerAddress,
      rating: rating,
    })
    await this.loadDb()
    return cid
  }
  getNumberOfRatingsFromCustomer(customerAddress) {
    const allRatings = this.getAllRatings()
    const customerRatings = allRatings
      .map((rating) => rating.customerAddress)
      .filter((address) => address === customerAddress)
    return customerRatings.length
  }

  getRatingsByCustomer(address) {
    const all = this.getAllRatings()
    const byCustomer = all.filter((el) => el.customer === address)
    return byCustomer
  }

  getAllRatings() {
    const allRatings = this.singleServiceRatingDb
      .iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value)
    return allRatings
  }

  async fetchTxHashFromRegistration(rating) {
    const accounts = await web3.eth.getAccounts()
    return new Promise((resolve) => {
      contract.methods
        .registerCustomerRating(rating)
        .send({ from: accounts[0], gas: 3000000 })
        .then(async (tx) => {
          resolve(tx.transactionHash)
        })
        .catch((err) => console.error(err))
    })
  }

  async stop() {
    return this.orbitdb.stop()
  }
}

module.exports = RatingLib
