import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const INITIAL_SUPPLY = ethers.BigNumber.from('10000000000000000000')

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
  } = hre

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('Defi1Deployment', {
    contract: 'ERC20Token',
    from: deployer,
    gasLimit: 4000000,
    args: [INITIAL_SUPPLY, 'Defi1 Token', 'DEFI1'],
    log: true
  })

  await deploy('Defi2Deployment', {
    contract: 'ERC20Token',
    from: deployer,
    gasLimit: 4000000,
    args: [INITIAL_SUPPLY, 'Defi2 Token', 'DEFI2'],
    log: true
  })
}

deploy.tags = ['erc20']
export default deploy
