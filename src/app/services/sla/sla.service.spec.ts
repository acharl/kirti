import { Service } from "./../../../../contracts/interfaces"
import { TestBed } from "@angular/core/testing"

import { SLAService } from "./sla.service"

describe("SlaServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it("should be created", () => {
    const service: SLAService = TestBed.get(SLAService)
    expect(service).toBeTruthy()
  })

  it("should return the address of a newly created contract", async () => {
    const service: SLAService = TestBed.get(SLAService)

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
        compensationPercentages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      },
    }

    const contractAddress = await service.createNewContract(newService)

    expect(contractAddress).toBeDefined()
  })
})
