const Web3 = require("web3")
const web3 = new Web3("ws://localhost:9545")

const main = async () => {
  const message = "723c46f1-4ee0-4edd-9de3-f7120bfe313a"
  const signature =
    "0xdaf123ccd2c257a846cf4afdeaebad5c1bd4b446426b5da53838cd42154979572eb7482a40a1ad01b892e8299c1119d570b7d244ba036411f9156f"
  const sig = signature.slice(2)
  const prefix = "\x19Ethereum Signed Message:\n" + message.length
  const h = web3.utils.sha3(prefix + message)
  const v = 27
  const r = `0x${sig.slice(0, 64)}`
  const s = `0x${sig.slice(64, 128)}`
  console.log(h)
  console.log(v)
  console.log(r)
  console.log(s)
}

main()
