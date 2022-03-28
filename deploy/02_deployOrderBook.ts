import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const INITIAL_SUPPLY = ethers.constants.WeiPerEther.mul(1000)

const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> =>
  input.status === 'fulfilled'

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    deployments,
    getNamedAccounts,
    network,
  } = hre

  // Cannot call `.fixture()` in deploy function.

  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const { provider } = ethers

  // Deploy two extra ERC20 tokens if it is not a live network
  if (!network.live) {
    // const baseNonce = await provider.getTransactionCount(deployer)

    // let nonceOffset = 0
    // const getNonce = () => baseNonce + nonceOffset++

    console.log('Deploy and mint DEFI1 and DEFI2...')

    // Use `Promise.allSettled()` ?
    await deploy('Defi1Deployment', {
      contract: 'MyERC20PresetMinterPauser',
      from: deployer,
      args: ['Defi1 Token', 'DEFI1'],
    })

    await deploy('Defi2Deployment', {
      contract: 'MyERC20PresetMinterPauser',
      from: deployer,
      args: ['Defi2 Token', 'DEFI2'],
      nonce: 1
    })

    // mint the two tokens
    // TODO: change to use `Promise.allSettled()` later
    const defi1 = await ethers.getContract('Defi1Deployment', deployer)
    const defi2 = await ethers.getContract('Defi2Deployment', deployer)
    await defi1.mint(deployer, INITIAL_SUPPLY)
    await defi2.mint(deployer, INITIAL_SUPPLY)
  }

  await deploy('OrderBook', {
    from: deployer,
    log: true
  })
}

deploy.tags = ['order_book']
export default deploy
