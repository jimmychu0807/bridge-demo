import { expect } from 'chai'
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat'

const INITIAL_SUPPLY = ethers.BigNumber.from('10000000000000000000')

describe('ERC20 Token', function() {
  it("should return a new ERC20 token", async function() {
    await deployments.fixture(['erc20'])
    const {deployer} = await getNamedAccounts()
    const defi1 = await ethers.getContract('Defi1Deployment', deployer)

    expect(await defi1.name()).to.equal('Defi1 Token')
    expect(await defi1.totalSupply()).to.equal(INITIAL_SUPPLY)
    expect(await defi1.balanceOf(defi1.address)).to.equal(INITIAL_SUPPLY)
  })

  it("should allow the deployer to spend the token on behalf of the contract", async function() {
    await deployments.fixture(['erc20'])
    const {deployer} = await getNamedAccounts()
    const defi1 = await ethers.getContract('Defi1Deployment', deployer)
    await defi1.transferFrom(defi1.address, deployer, '10000')
    expect(await defi1.balanceOf(deployer)).to.equal('10000')
  })
})
