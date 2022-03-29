import { config, setupUsers } from './setup'
import hre from 'hardhat'

const { ethers, network } = hre

async function main() {
  const { alith, baltathar } = await setupUsers(network.name)

  const tokenBid = ethers.constants.WeiPerEther.mul(1)
  const tokenAsk = ethers.constants.WeiPerEther.mul(1)
  console.log("Approving spending and wait for block mined...")
  const resp = await baltathar.defi2.approve(alith.orderBook?.address, tokenAsk)
  await resp.wait(3)

  const orderLen = (await baltathar.orderBook?.ordersLen()).toNumber()
  console.log('OrderBook Length:', orderLen)
  const txResponse = await baltathar.orderBook?.takeOrder(orderLen - 1)

  console.log(`Baltathar takes the order of exchanging ${ethers.utils.formatEther(tokenBid)} DEFI1 for ${ethers.utils.formatEther(tokenAsk)} DEFI2`)
  console.log('---')
  console.log('txResponse', txResponse)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
