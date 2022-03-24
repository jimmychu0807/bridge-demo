import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult =>
  input.status === 'rejected'
const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'

const INITIAL_SUPPLY = ethers.BigNumber.from('100000000000000000000')

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
    getChainId,
    getUnnamedAccounts
  } = hre

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const accts = await getUnnamedAccounts()

  await deploy('Defi1Deployment', {
    contract: 'ERC20',
    from: deployer,
    gasLimit: 4000000,
    args: [INITIAL_SUPPLY, 'Defi1 Token', 'DEFI1']
  })

  await deploy('Defi2Deployment', {
    contract: 'ERC20',
    from: deployer,
    gasLimit: 4000000,
    args: [INITIAL_SUPPLY, 'Defi2 Token', 'DEFI2']
  })
}

deploy.tags = ['ERC20Token']
export default deploy
