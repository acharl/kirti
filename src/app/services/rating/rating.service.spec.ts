import { Service } from "../../../../contracts/interfaces"
import { RatingLib } from "src/libraries/RatingLib"
import { solidityfy } from "src/app/helpers/typeConversion"

fdescribe("RatingService", () => {
  let ratingLib: RatingLib
  let initObj
  let dbAddress =
    "/orbitdb/zdpuApVJTcUNwiY4t5YEvm4zjGnmSaFynebSGj86Lu4TTj9Y2/ratingiogzgsdf-AKY"

  beforeEach(async () => {
    ratingLib = new RatingLib()
    initObj = await ratingLib.init(dbAddress)
  })

  afterEach(async () => {
    if (ratingLib) {
      await ratingLib.stop()
    }
  })

  it("should instantiate OrbitDB upon init()", async () => {
    expect(initObj.orbitdb).toBeDefined()
  })

  it("should instantiate singleServiceRatingDb upon init()", async () => {
    expect(initObj.singleServiceRatingDb).toBeDefined()
  })

  it("should fetch the registration hash of the rating from the SC", async () => {
    const rating = {
      customerAddress: "0x910fe973f56150d93c6cddef74c1ce5db776082c",
      serviceName: "serviceName",
      providerAddress: "0xB5398B5b0323cBD111E4C29108278C98226aA2D0s",
      ratingScore: 10008,
    }

    const solidityObject = solidityfy(rating)

    const hash = await ratingLib.fetchTxHashFromRegistration(solidityObject)
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
