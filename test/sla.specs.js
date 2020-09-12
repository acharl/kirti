const SLA = artifacts.require("SLA")
const truffleAssert = require("truffle-assertions")
const Web3 = require("web3")
var web3 = new Web3("ws://localhost:9545")
const sla = require("../build/contracts/SLA.json")
const EthereumJSUtils = require("ethereumjs-util")

contract.only("SLA", (accounts) => {
  let contract
  let web3ContractInstance
  const customer = accounts[0]
  const provider = accounts[1]
  const monitor = accounts[2]

  const price = web3.utils.toWei("1")

  beforeEach(async () => {
    contract = await SLA.new()

    web3ContractInstance = new web3.eth.Contract(sla.abi, contract.address)
    const createdAt = Date.now()
    const validity = 60 * 60 * 14 * 30
    const expiresAt = Date.now() + validity * 1000

    const tx = await contract.init(
      price,
      customer,
      provider,
      monitor,
      365,
      99,
      99,
      [50, 30, 20, 40, 25, 15, 30, 10, 5],
      [50, 30, 20, 40, 25, 15, 30, 10, 5],
      [createdAt, expiresAt, validity]
    )
    console.log("init():", tx.receipt.gasUsed)
    const pay = await contract.payForService({
      from: customer,
      value: price,
    })
    console.log("pay():", pay.receipt.gasUsed)
  })

  it("should correctly report a violation ", async () => {
    const tx = await contract.reportViolationFromAPI(
      "0xe69fe2575d9119d155179435f4daa4e49fda764d91d2b7ddcdd0b47d9b976f22",
      "27",
      "0x69e4df3241f61c9b0d645933c235a35403979ba807909d1967f56ea718bb783c",
      "0x43ceaff7f9390d0e68f3de22691f32ca88074ccd8f1d9066b715f7ce87635299",
      { violationType: 0, violationSeverity: 1 }
    )
    console.log("reportViolationFromAPI():", tx.receipt.gasUsed)
    truffleAssert.eventEmitted(tx, "ViolationReported")
  })
  it("should correctly initOraclizeCallback()", async () => {
    const tx = await contract.initOraclizeCallback(7)
    console.log("initOraclizeCallback():", tx.receipt.gasUsed)
  })
  it("should correctly payForService()", async () => {
    const tx = await contract.payForService()
    console.log("payForService():", tx.receipt.gasUsed)
  })

  it("should correctly updateCompensation()", async () => {
    const tx = await contract.updateCompensation()
    console.log("updateCompensation():", tx.receipt.gasUsed)
  })
  it("should correctly getValidityPeriod()", async () => {
    const tx = await contract.getValidityPeriod()
    console.log("getValidityPeriod():", tx.receipt.gasUsed)
  })
  it("should correctly getViolations()", async () => {
    const tx = await contract.getViolations()
    console.log("getViolations():", tx.receipt.gasUsed)
  })
  it("should correctly getState()", async () => {
    const tx = await contract.getState()
    console.log("getState():", tx.receipt.gasUsed)
  })

  it("should correctly report a violation from the API", async function () {
    let msg = "haribol"
    let prefix = "\x19Ethereum Signed Message:\n" + msg.length
    let h = web3.utils.sha3(prefix + msg)
    let sig1 = await signMessage(
      msg,
      "c089205928aad2a09c400d94d3fc0da02b93e0f80e545e4aac24064378a38b5b"
    ) //
    var sig = sig1.slice(2)
    var r = `0x${sig.slice(0, 64)}`
    var s = `0x${sig.slice(64, 128)}`
    var v = 27 // web3.utils.hexToNumber(sig.slice(128, 130)) + 27

    var tx = await contract.reportViolationFromAPI(h, v, r, s, {
      violationType: 2,
      violationSeverity: 0,
    })
    truffleAssert.eventEmitted(tx, "ViolationReported")

    const customerBalanceBefore = await web3.eth.getBalance(customer)
    await contract.terminate()
    const customerBalanceAfter = await web3.eth.getBalance(customer)
    assert.isAbove(Number(customerBalanceAfter), Number(customerBalanceBefore))
  })

  it("should correctly terminate()", async () => {
    const tx = await contract.terminate()
    console.log("terminate():", tx.receipt.gasUsed)
  })

  const signMessage = async (message, privateKey) => {
    const messageBuffer = EthereumJSUtils.hashPersonalMessage(
      EthereumJSUtils.toBuffer(message)
    )
    const signature = EthereumJSUtils.ecsign(
      messageBuffer,
      Buffer.from(privateKey, "hex")
    )

    return EthereumJSUtils.toRpcSig(signature.v, signature.r, signature.s)
  }
})
