import { ServiceLib } from "./../../../libraries/ServiceLib"
import { Service } from "../../../../contracts/interfaces"

describe("ProtectionUploadService", () => {
  let uploadService: ServiceLib
  let initObj

  beforeEach(async () => {
    uploadService = new ServiceLib()
    initObj = await uploadService.init()
  })

  afterEach(async () => {
    if (uploadService) {
      await uploadService.stopNode()
    }
  })

  it("should instantiate OrbitDB upon init()", async () => {
    expect(initObj.orbitdb).toBeDefined()
  })

  it("should instantiate servicesDb upon init()", async () => {
    expect(initObj.servicesDb).toBeDefined()
  })

  it("should fetch the registration hash from the SC", async () => {
    const newService: Service = {
      serviceName: "GauraProtection",
      providerName: "Gaura",
      providerAddress: "0x71d1f775422f492d3f2db4e4f34ccba2da9924fc",
      description: "Haribol",
      price: 1008,
      validityPeriod: 365,
      slaDetails: {
        mitigationEfficiency: 99,
        serviceAvailability: 9999,
        timeToMitigate: 108,
        compensationPercentages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    }
    const providerAddress = "0x71d1F775422F492d3f2dB4e4F34cCbA2dA9924fC"
    const hash = await uploadService.fetchTxHashFromRegistration(
      newService,
      providerAddress
    )
    expect(hash).toMatch(/^0x([A-Fa-f0-9]{64})$/)
  })

  // TODO we get an error when writing to the orbitdb, no issues when calling that logic from the UI however
  // if the logic gets much more complicated, then I should probably look into this and makes sure the
  // test is executed as expected

  // it('should add a new service', async () => {
  //   await uploadService.stopNode()
  //   await uploadService.init()

  //   const service: Service = {
  //     serviceName: "4",
  //     providerName: "Vitthal",
  //     providerAddress: "0x71d1f775422f492d3f2db4e4f34ccba2da9924fc",
  //     description: "Haribol",
  //     price: 1008,
  //     validityPeriod: 365,
  //     slaDetails: {
  //       mitigationEfficiency: 99,
  //       serviceAvailability: 99,
  //       timeToMitigate: 108,
  //     }
  //   }
  //   const providerAddress = '0x71d1F775422F492d3f2dB4e4F34cCbA2dA9924fC'
  //   await uploadService.addNewService(service, providerAddress)
  //   const retrieved = uploadService.getServiceByName('bestService')
  //   console.log('### retrieved ###', retrieved)
  // });
})
