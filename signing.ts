const ethUtils = require("ethereumjs-util")
const { v4: uuidv4 } = require("uuid")

const message = uuidv4()
const privateKey = process.argv[2]

const signMessage = async (message, privateKey) => {
  const messageBuffer: Buffer = ethUtils.hashPersonalMessage(
    ethUtils.toBuffer(message)
  )
  const signature: {
    v: string
    r: string
    s: string
  } = ethUtils.ecsign(messageBuffer, Buffer.from(privateKey, "hex"))

  return ethUtils.toRpcSig(signature.v, signature.r, signature.s)
}

const run = async () => {
  const signature = await signMessage(message, privateKey)
  console.log("#############################")
  console.log("MESSAGE")
  console.log(message)
  console.log("*****************************")

  console.log("SIGNATURE")
  console.log(signature)
  console.log("#############################")
}

run()
