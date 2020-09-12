// type SolidityServiceObject = Array<string | number>

function serviceToSolidityObject(rawService) {
  const service = removeOptionalParameters(rawService)
  return solidityfy(service)
}

function removeOptionalParameters(rawService) {
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
/**
 *
 * @param obj any
 * @param rec?: boolean
 * @param arr?: any[]
 */
function solidityfy(obj, rec, arr) {
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
module.exports = serviceToSolidityObject
