import hre from 'hardhat'

const { ethers, network } = hre

const config = {
  "bsctestnet": {
    "DEFI1": "0xd1041a9b6107b2b741a2c32ab213281be0e824a1",
    "DEFI2": "0x0747bfa4ef33ee164e1df03e02752c35d17db204",
    "OrderBook": null,
  },
  "alttest": {
    "DEFI1": "0x508353171a407529D09382F4f2F035D1Ff1Af448",
    "DEFI2": "0x8c714d2f35eca0edfff97ccc7c3d4e00edea8f3b",
    "OrderBook": "0x5F48872D2F81d555c287F1dc2379B6E5fe1346C8",
  }
}

const IERC20 = '@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20'

async function setupUsers(networkName: string) {
  const { alith: aAddr, baltathar: bAddr } = await hre.getNamedAccounts()

  if (networkName != 'bsctestnet' && networkName != 'alttest') {
    console.log(`Network '${networkName}' not support. Currently only support 'bsctestnet' or 'alttest'.`)
    process.exit(1)
  }

  const { DEFI1, DEFI2, OrderBook } = config[networkName]
  const alith = {
    address: aAddr,
    defi1: await ethers.getContractAt(IERC20, DEFI1, aAddr),
    orderBook: OrderBook ? (await ethers.getContractAt('OrderBook', OrderBook, aAddr)) : null
  }
  const baltathar = {
    address: bAddr,
    defi2: await ethers.getContractAt(IERC20, DEFI2, bAddr),
    orderBook: OrderBook ? (await ethers.getContractAt('OrderBook', OrderBook, bAddr)) : null
  }

  return { alith, baltathar }
}

export { config, setupUsers }
