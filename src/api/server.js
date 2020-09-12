const express = require("express")
const app = express()
const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")

const sla = require("../../build/contracts/sla.json")
const cors = require("cors")

const ServiceLib = require("../libraries/ServiceLib")
const RatingLib = require("../libraries/RatingLib")
const CustomerLib = require("../libraries/CustomerLib")
const MonitorLib = require("../libraries/MonitorLib")

const allowedOrigins = ["http://localhost:4200"]

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true)
  },
}

const privateCorsOptions = {
  origin: (origin, callback) => {
    console.log("origin", origin)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Origin not allowed by CORS"))
    }
  },
}

// Enable preflight requests for all routes
app.options("*", cors(corsOptions))

app.use(express.json())

app.post(
  "/contracts/:address/violation",
  cors(corsOptions),
  async (req, res) => {
    const address = req.params.address
    const contract = new web3.eth.Contract(sla.abi, address)
    const message = req.body.message
    const signature = req.body.signature
    const violationType = req.body.violationType
    const violationSeverity = req.body.violationSeverity

    const sig = signature.slice(2)
    const prefix = "\x19Ethereum Signed Message:\n" + message.length
    const h = web3.utils.sha3(prefix + message)
    const v = 27
    const r = `0x${sig.slice(0, 64)}`
    const s = `0x${sig.slice(64, 128)}`

    const violation = {
      violationType: violationType,
      violationSeverity: violationSeverity,
    }

    const accounts = await web3.eth.getAccounts()
    console.log(h, v, r, s, violation)
    contract.methods
      .reportViolationFromAPI(h, v, r, s, violation)
      .send({
        from: accounts[0],
        gas: 3000000,
      })
      .then((tx) => {
        res.status(200).send({
          status: "Success",
          message: `successfully reported ${JSON.stringify(violation)} @${
            tx.transactionHash
          }`,
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(422).send({
          status: "FAILED",
          message: `${err}`,
        })
      })
  }
)

app.get(
  "/contracts/:address/violations",
  cors(corsOptions),
  async (req, res) => {
    const address = req.params.address

    const accounts = await web3.eth.getAccounts()
    const contract = new web3.eth.Contract(sla.abi, address)
    const tx = await contract.methods.getViolations().send({
      from: accounts[0],
    })

    const violations = tx.events.LogViolations.returnValues.violations.map(
      (el) => {
        return {
          violationType: el.violationType,
          violationSeverity: el.violationSeverity,
        }
      }
    )

    res.status(200).send(violations)
  }
)

app.get(
  "/contracts/:address/thresholds",
  cors(corsOptions),
  async (req, res) => {
    const address = req.params.address

    const accounts = await web3.eth.getAccounts()
    const contract = new web3.eth.Contract(sla.abi, address)
    const tx = await contract.methods.getViolationThresholds().send({
      from: accounts[0],
    })

    const thresholds =
      tx.events.LogViolationThresholds.returnValues.violationThresholds

    const response = {
      "Time to Mitigate": {
        HIGH: `more than ${thresholds[0]}mins`,
        MEDIUM: `more than ${thresholds[1]}mins`,
        LOW: `more than ${thresholds[2]}mins`,
      },
      "Mitigation Efficiency": {
        HIGH: `less than ${thresholds[3]}%`,
        MEDIUM: `less than ${thresholds[4]}%`,
        LOW: `less than ${thresholds[5]}%`,
      },
      "Service Availability": {
        HIGH: `less than ${thresholds[6]}%`,
        MEDIUM: `less than ${thresholds[7]}`,
        LOW: `less than ${thresholds[8]}%`,
      },
    }

    res.status(200).send(response)
  }
)

app.get("/contracts/:address/state", cors(corsOptions), async (req, res) => {
  const address = req.params.address
  const contract = new web3.eth.Contract(sla.abi, address)
  const accounts = await web3.eth.getAccounts()

  const tx = await contract.methods.getState().send({
    from: accounts[0],
  })

  let rawState
  try {
    rawState = tx.events.LogState.returnValues.state
  } catch (error) {
    res.status(200).send({ error: "Contract not available anymore" })
  }

  if (!rawState) {
    res.status(200).send({ error: "State could not be fetched" })
  } else {
    const state = {
      isActivated: rawState.isActivated,
      isTerminated: rawState.isTerminated,
      currentCompensation: rawState.currentCompensation,
      violationCount: rawState.violationCount,
    }
    res.status(200).send({ success: state })
  }
})

app.get("/contracts/:address/validity", cors(corsOptions), async (req, res) => {
  const address = req.params.address
  const contract = new web3.eth.Contract(sla.abi, address)
  const accounts = await web3.eth.getAccounts()

  const tx = await contract.methods.getValidityPeriod().send({
    from: accounts[0],
  })

  let rawValidityPeriod
  try {
    rawValidityPeriod = tx.events.LogValidityPeriod.returnValues[0]
  } catch (error) {
    res.status(200).send({ error: "Contract not available anymore" })
  }
  const validityPeriod = {
    createdAt: rawValidityPeriod[0],
    expiresAt: rawValidityPeriod[1],
    validity: rawValidityPeriod[2],
  }
  res.status(200).send(validityPeriod)
})

app.post("/contracts/pay/:address/", cors(corsOptions), async (req, res) => {
  const address = req.params.address
  const ethPrice = req.body.ethPrice

  const contract = new web3.eth.Contract(sla.abi, address)

  const accounts = await web3.eth.getAccounts()
  const tx = await contract.methods.payForService().send({
    from: accounts[0],
    value: web3.utils.toWei(ethPrice.toString()),
    gas: 3000000,
  })

  console.log(tx.transactionHash)
  res.status(200).send(tx)
})

app.get("/orbitdb/services/all", cors(corsOptions), async (req, res) => {
  const serviceLib = new ServiceLib()
  await serviceLib.init()
  await serviceLib.loadDb()

  const all = serviceLib.getAllServices()
  res.status(200).send(all)
})

app.post("/orbitdb/services/add", cors(corsOptions), async (req, res) => {
  const serviceLib = new ServiceLib()
  await serviceLib.init()

  await serviceLib.loadDb()

  const newService = req.body.newService
  const providerAddress = req.body.providerAddress

  serviceLib
    .addNewService(newService, providerAddress)
    .then((txHash) => {
      res.status(200).send({ success: txHash })
    })
    .catch((err) => {
      res.status(200).send({
        error: `ERROR: ${err}`,
      })
    })
})

app.get(
  "/orbitdb/ratings/service/:name",
  cors(corsOptions),
  async (req, res) => {
    const serviceName = req.params.name

    const serviceLib = new ServiceLib()
    await serviceLib.init()
    await serviceLib.loadDb()

    const ratingDb = await serviceLib.getRatingsDbOfService(serviceName)

    const ratingLib = new RatingLib()
    await ratingLib.init(ratingDb)
    await ratingLib.loadDb()

    const all = ratingLib.getAllRatings()
    res.status(200).send(all)
  }
)

app.post("/orbitdb/ratings/add", cors(privateCorsOptions), async (req, res) => {
  const rating = req.body
  const serviceName = rating.serviceName
  const customerAddress = rating.customerAddress

  if (!rating || !serviceName || !customerAddress) {
    res.status(200).send({
      error: `Incorrect parameters ${JSON.stringify(rating)} ${JSON.stringify(
        serviceName
      )} ${JSON.stringify(customerAddress)}`,
    })
  }

  const serviceLib = new ServiceLib()
  await serviceLib.init()
  await serviceLib.loadDb()

  const ratingDb = await serviceLib.getRatingsDbOfService(serviceName)

  const customerLib = new CustomerLib()
  await customerLib.init()
  await customerLib.loadDb()

  const ratingLib = new RatingLib()
  await ratingLib.init(ratingDb)
  await ratingLib.loadDb()

  const customer = customerLib.getCustomerByAddress(customerAddress)
  if (!customer) {
    res.status(200).send({
      error:
        "To leave a rating, you must have first purchased this service, but you haven't purchased any",
    })
  }
  const found = customer.services.filter(
    (service) => service.serviceName === serviceName
  )
  const ratings = await ratingLib.getRatingsByCustomer(customerAddress)

  const numberOfPurchases = found.length
  const numberOfRatings = ratings && ratings.length ? ratings.length : 0

  if (numberOfPurchases === 0) {
    res.status(200).send({
      error: "you must purchase services before leaving a rating for them",
    })
  } else if (numberOfRatings >= numberOfPurchases) {
    res.status(200).send({
      error:
        "you have already left as many ratings as you have purchased this service",
    })
  } else {
    ratingLib
      .addRatingForService(rating)
      .then((txHash) => {
        res.status(200).send({ success: txHash })
      })
      .catch((err) => {
        res.status(200).send({
          error: `ERROR: your rating could not be submitted ${err}`,
        })
      })
  }
})

/**
 * CUSTOMERS
 */

app.get("/orbitdb/customers/all", cors(corsOptions), async (req, res) => {
  const customerLib = new CustomerLib()
  await customerLib.init()
  await customerLib.loadDb()

  const all = customerLib.getAllCustomers()
  res.status(200).send(all)
})

app.get(
  "/orbitdb/customers/customer/:address",
  cors(corsOptions),
  async (req, res) => {
    const address = req.params.address
    const customerLib = new CustomerLib()
    await customerLib.init()
    await customerLib.loadDb()

    const customer = customerLib.getCustomerByAddress(address)
    res.status(200).send(customer)
  }
)

app.post(
  "/orbitdb/customers/service/add",
  cors(privateCorsOptions),
  async (req, res) => {
    const customerAddress = req.body.customerAddress
    const service = req.body.service
    if (!service || !customerAddress) {
      res.status(404).send()
    }
    const customerLib = new CustomerLib()
    await customerLib.init()
    await customerLib.loadDb()

    customerLib
      .addServiceForCustomer(customerAddress, service)
      .then((txHash) => {
        res.status(200).send({ success: txHash })
      })
      .catch((err) => {
        res.status(200).send({
          error: `ERROR: service could be not added for customer ${err}`,
        })
      })
  }
)

app.get("/orbitdb/monitors/all", cors(corsOptions), async (req, res) => {
  const monitorLib = new MonitorLib()
  await monitorLib.init()
  await monitorLib.loadDb()

  const all = monitorLib.getAllMonitors()
  res.status(200).send(all)
})

app.post("/orbitdb/monitors/add", cors(corsOptions), async (req, res) => {
  const address = req.body.address
  const name = req.body.name

  if (!address || !name) {
    res.status(404).send()
  }
  const monitorLib = new MonitorLib()
  await monitorLib.init()
  await monitorLib.loadDb()

  monitorLib
    .addNewMonitor(name, address)
    .then((cid) => {
      res.status(200).send({
        "Success!":
          "Please note the encoding scheme when reporting violation as seen below",
        violationType: {
          "Time to mitigate": 0,
          "Mitigation Efficiency": 1,
          "Service Availability": 2,
        },
        violationSeverity: {
          LOW: 0,
          MEDIUM: 1,
          HIGH: 2,
        },
      })
    })
    .catch((err) => {
      res.status(200).send({
        error: `ERROR: monitor could not be added ${err}`,
      })
    })
})

app.listen(1008, () => {
  console.log("Server listening")
})
