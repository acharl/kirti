const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")
const kirti = require("../../build/contracts/Kirti.json")

const contract = new web3.eth.Contract(
  kirti.abi,
  kirti.networks["5777"].address
)
export class ContractCreator {
  constructor() {}

  async createNewContract(service) {
    const accounts = await web3.eth.getAccounts()
    console.log("accounts")
    const solidityObject = [
      service.serviceName,
      service.providerName,
      service.customerAddress,
      service.providerAddress,
      service.monitorAddress,
      service.description,
      service.price,
      service.validityPeriod,
      service.slaDetails,
    ]
    this.tx = await contract.methods
      .newSLA(solidityObject)
      .send({ from: accounts[0], gas: 3000000 })
      .catch((err) => console.error(err))
    console.log(this.tx)
    const contractAddress = this.tx.events.SLAContractCreated.returnValues
      .contractAddress
    return contractAddress
  }
}
