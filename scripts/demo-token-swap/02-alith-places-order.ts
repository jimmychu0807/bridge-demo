import { config, setupUsers } from './setup'
import hre from 'hardhat'

const { ethers, network } = hre

async function main() {
  const { alith, baltathar } = await setupUsers(network.name)

  const tokenBid = ethers.constants.WeiPerEther.mul(1)
  const tokenAsk = ethers.constants.WeiPerEther.mul(2)

  await alith.defi1.approve(alith.orderBook?.address, tokenBid)
  const txReceipt = await alith.orderBook?.placeOrder(alith.defi1.address, tokenBid, baltathar.defi2.address, tokenAsk)

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
