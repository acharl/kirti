import { Service } from "contracts/interfaces"
import { ContractCreator } from "./ContractCreator"
const Web3 = require("web3")
const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545")

describe("ContractCreator", () => {
  let contractCreator: ContractCreator

  beforeEach(async () => {
    contractCreator = new ContractCreator()
  })

  it("should return the address of a newly created contract", async () => {
    const newService: Service = {
      serviceName: "GauraProtection",
      providerName: "Gaura",
      providerAddress: "0x71d1f775422f492d3f2db4e4f34ccba2da9924fc",
      description: "Haribol",
      price: 1008,
      validityPeriod: 365,
      slaDetails: {
        mitigationEfficiency: 99,
        serviceAvailability: 99,
        timeToMitigate: 108,
      },
    }

    const contractAddress = await contractCreator.createNewContract(newService)
    const isAddress = web3.utils.isAddress(contractAddress)
    expect(isAddress).toBeTruthy()
  })
})
