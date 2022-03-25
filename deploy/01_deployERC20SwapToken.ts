import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
  } = hre

  const { deploy } = deployments
  const { deployer, tokenOwner } = await getNamedAccounts()

  await deploy('Defi1Deployment', {
    contract: 'ERC20SwapToken',
    from: deployer,
    args: [tokenOwner, 'Defi1 Token', 'DEFI1'],
    log: true
  })

  await deploy('Defi2Deployment', {
    contract: 'ERC20SwapToken',
    from: deployer,
    args: [tokenOwner, 'Defi2 Token', 'DEFI2'],
    log: true
  })
}

deploy.tags = ['erc20']
export default deploy
