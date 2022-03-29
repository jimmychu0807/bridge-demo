import { config, setupUsers } from './setup'
import hre from 'hardhat'

const { ethers, network } = hre

async function main() {
  const { alith, baltathar } = await setupUsers(network.name)
  console.log(`Alith DEFI1 balance: ${ethers.utils.formatEther(await alith.defi1.balanceOf(alith.address))}`)
  console.log(`Alith DEFI2 balance: ${ethers.utils.formatEther(await baltathar.defi2.balanceOf(alith.address))}`)
  console.log(`Baltathar DEFI1 balance: ${ethers.utils.formatEther(await alith.defi1.balanceOf(baltathar.address))}`)
  console.log(`Baltathar DEFI2 balance: ${ethers.utils.formatEther(await baltathar.defi2.balanceOf(baltathar.address))}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
