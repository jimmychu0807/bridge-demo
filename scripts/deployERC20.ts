import { ethers } from "hardhat"

const INITIAL_SUPPLY = ethers.BigNumber.from('100000000000000000000')

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`)



  const twoTokenCFs = Promise.allSettled([
    ethers.getContractFactory(INITIAL_SUPPLY, 'Defi1 Token', 'DEFI1'),
    ethers.getContractFactory(INITIAL_SUPPLY, 'Defi2 Token', 'DEFI2'),
  ])

  const twoTokenDeployed = Promise.allSettled(twoTokenCFs)
  console.log(`DEFI1 deployed at: ${twoTokenDeployed[0]}\n DEFI2 deployed at: ${twoTokenDeployed[1]}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
