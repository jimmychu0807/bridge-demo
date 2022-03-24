import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const INITIAL_SUPPLY = ethers.BigNumber.from('100000000000000000000')

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts
  } = hre

  const { deploy } = deployments
  const { deployer, tokenOwner } = await getNamedAccounts()

  console.log(`deployer: ${deployer}`)
  console.log(`tokenOwner: ${tokenOwner}`)

  await deploy('SimpleERC20', {
    from: deployer,
    args: [tokenOwner, INITIAL_SUPPLY],
    log: true
  })
}

deploy.tags = ['erc20']
export default deploy
