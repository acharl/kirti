const kirti = artifacts.require("Kirti")
const SLA = artifacts.require("SLA")

const Web3 = require("web3")
const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545")
const truffleAssert = require("truffle-assertions")
const sla = require("./../build/contracts/SLA.json")

contract("Kirti", async (accounts) => {
  let slaContractAddress
  describe("URL Requests Tests", async () => {
    contract("Factory", async () => {
      it("should create a new SLA contract", async () => {
        const solidityObject = [
          "serviceName",
          "providerName",
          accounts[0],
          accounts[1],
          accounts[2],
          "description",
          web3.utils.toWei("1"),
          365,
          [
            99,
            99,
            30,
            [50, 30, 20, 40, 25, 15, 30, 10, 5],
            [50, 30, 20, 40, 25, 15, 30, 10, 5],
          ],
        ]

        const contract = await kirti.new()
        const newContractTransaction = await contract.newSLA(solidityObject)
        slaContractAddress = newContractTransaction.logs[0].args.contractAddress
        const isAddress = web3.utils.isAddress(slaContractAddress)
        expect(isAddress).to.be.true
        truffleAssert.eventEmitted(newContractTransaction, "SLAContractCreated")
      })

      it("should register a new service", async () => {
        const solidityObject = [
          "SEVA",
          "Thakurji",
          "0xa70cfe3d98a6ab64fbf5cee0f34b1410d2f2b758",
          "2",
          "2",
          "2",
          [
            2,
            2000,
            2000,
            [2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2],
          ],
        ]

        const contract = await kirti.new()
        const newContractTransaction = await contract.registerService(
          solidityObject
        )
        truffleAssert.eventEmitted(newContractTransaction, "ServiceRegistered")
      })

      it("should allow to pay for a new SLA contract", async () => {
        const slaContract = await SLA.at(slaContractAddress)
        expect(slaContract).to.exist
        const newContractTransaction = await slaContract.payForService({
          value: web3.utils.toWei("7", "ether"),
        })
        truffleAssert.eventEmitted(newContractTransaction, "ServicePaid")
      })

      it("should allow to pay for a new SLA contract using web3", async () => {
        const slaContract = await SLA.at(slaContractAddress)
        expect(slaContract).to.exist
        const contract = await new web3.eth.Contract(
          sla.abi,
          slaContractAddress
        )

        contract.methods
          .payForService()
          .send({
            from: "0x71d1f775422f492d3f2db4e4f34ccba2da9924fc",
            gas: 3000000,
            value: web3.utils.toWei("6", "ether"),
          })
          .then(async (tx) => {
            expect(tx).to.exist
          })
          .catch((err) => console.error(err))
      })
    })
  })
})
