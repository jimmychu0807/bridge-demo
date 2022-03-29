import config from './config.json'
import hre from 'hardhat'

const { ethers, network } = hre

async function main() {
  const { alith: aAddr, baltathar: bAddr } = await hre.getNamedAccounts()

  if (network.name != 'bsctestnet' && network.name != 'alttest') {
    console.log(`Network '${network.name}' not support. Currently only support 'bsctestnet' or 'alttest'.`)
    process.exit(1)
  }

  let alith = {
    address: aAddr,
    defi1: await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', config[network.name].DEFI1, aAddr),
  }
  let baltathar = {
    address: bAddr,
    defi2: await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', config[network.name].DEFI2, bAddr),
  }

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
