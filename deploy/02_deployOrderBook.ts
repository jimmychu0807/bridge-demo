import { ethers, deployments } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol"

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
    network,
  } = hre

  // Cannot call `.fixture()` in deploy function.

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Deploy two extra ERC20 tokens if it is not a live network
  if (!network.live) {
    ethers.getContract("ERC20PresetMinterPauser")
  }

  const defi1 = await ethers.getContract('Defi1Deployment', deployer)
  const defi2 = await ethers.getContract('Defi2Deployment', deployer)

  await deploy('SimpleSwap', {
    contract: 'SimpleSwap',
    from: deployer,
    args: [defi1.address, defi2.address, 1000],
    log: true
  })
}

deploy.tags = ['swap']
export default deploy
