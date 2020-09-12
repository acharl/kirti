import { SLA } from "./../../../contracts/interfaces"
import { Service } from "../../../contracts/interfaces"

export type SolidityServiceObject = Array<string | number>

function serviceToSolidityObject(rawService: Service) {
  const service = removeOptionalParameters(rawService)
  return solidityfy(service)
}

function removeOptionalParameters(rawService): Service {
  const service = {
    serviceName: rawService.serviceName,
    providerName: rawService.providerName,
    providerAddress: rawService.providerAddress,
    // customerAddress: rawService.customerAddress,
    // monitorAddress: rawService.monitorAddress,
    description: rawService.description,
    price: rawService.price,
    validityPeriod: rawService.validityPeriod,
    slaDetails: rawService.slaDetails,
  }
  return service
}

// note: the order of elements matters
function solidityfy(
  obj: any,
  rec?: boolean,
  arr?: any[]
): SolidityServiceObject {
  // The reasoning is that obj might include optional parameters which we don't want to pass
  arr = arr ? arr : []
  let subarray = []
  for (let [key, value] of Object.entries(obj)) {
    if (typeof value !== "object" || Array.isArray(value)) {
      if (rec) {
        subarray.push(value)
      } else {
        arr.push(value)
      }
    } else if (typeof value === "object") {
      return solidityfy(value, true, arr)
    }
  }
  if (rec) {
    arr.push(subarray)
  }
  return arr
}

module.exports = serviceToSolidityObject
module.exports = solidityfy
