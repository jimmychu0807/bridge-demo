import { ethers, deployments } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const INITIAL_SUPPLY = ethers.BigNumber.from('10000000000000000000')

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
  } = hre

  // Cannot call `.fixture()` in deploy function.

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

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
deploy.dependencies = ['erc20']
export default deploy
