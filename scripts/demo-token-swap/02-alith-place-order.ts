import config from './config.json'
import hre from 'hardhat'

const { ethers, network } = hre

async function main() {
  const { alith: aAddr, baltathar: bAddr } = await hre.getNamedAccounts()

  if (network.name != 'alttest') {
    console.log(`Network '${network.name}' not support. Currently only support 'alttest'.`)
    process.exit(1)
  }

  let alith = {
    address: aAddr,
    defi1: await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', config[network.name].DEFI1, aAddr),
    orderBook: await ethers.getContractAt('OrderBook', config[network.name]?.OrderBook, aAddr),
  }
  let baltathar = {
    address: bAddr,
    defi2: await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', config[network.name].DEFI2, bAddr),
    orderBook: await ethers.getContractAt('OrderBook', config[network.name]?.OrderBook, aAddr),
  }

  const tokenBid = ethers.constants.WeiPerEther.mul(1)
  const tokenAsk = ethers.constants.WeiPerEther.mul(2)
  await alith.defi1.approve(alith.orderBook.address, tokenBid)
  const txReceipt = await alith.orderBook.placeOrder(alith.defi1.address, tokenBid, baltathar.defi2.address, tokenAsk)

  console.log(`Alith places an order of exchanging ${ethers.utils.formatEther(tokenBid)} DEFI1 for ${ethers.utils.formatEther(tokenAsk)} DEFI2`)
  console.log('---')
  console.log('txReceipt', txReceipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
