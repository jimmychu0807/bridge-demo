import { ethers } from "hardhat"
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const X_BASIS = 1000
const rate = 2;

async function deploy(hre: HardhatRuntimeEnvironment) {
  const {
    getNamedAccounts,
    deployments,
    getChainId,
    network
  } = hre

  const { deploy } = deployments
  const { deployer, tokenOwner } = await getNamedAccounts()

  await deploy('Defi1Deployment', {
    contract: 'ERC20SwapToken',
    from: deployer,
    args: [tokenOwner, 'Defi1 Token', 'DEFI1'],
    log: true,
  })

  await deploy('Defi2Deployment', {
    contract: 'ERC20SwapToken',
    from: deployer,
    args: [tokenOwner, 'Defi2 Token', 'DEFI2'],
    log: true,
  })

  if (network.live) {
    // We also set a basic exchange rate among DEFI1 and DEFI2
    const tokenOwner_defi1 = await ethers.getContract('Defi1Deployment', tokenOwner)
    const tokenOwner_defi2 = await ethers.getContract('Defi2Deployment', tokenOwner)

    console.log(`Set Exchange Rate at DEFI2: 1 DEFI1 : ${rate} DEFI2`)
    await tokenOwner_defi2.setExchangeRate(tokenOwner_defi1.address, X_BASIS * rate)

    console.log(`Set Exchange Rate at DEFI1: ${rate} DEFI2 : 1 DEFI1`)
    await tokenOwner_defi1.setExchangeRate(tokenOwner_defi2.address, X_BASIS / rate)
  }
}

deploy.tags = ['erc20', 'live']
export default deploy
