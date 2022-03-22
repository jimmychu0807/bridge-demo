import { expect } from 'chai'
import { ethers } from 'hardhat'

const INITIAL_SUPPLY = ethers.BigNumber.from('10000000000000000000')

describe('ERC20 Token', function() {
  it("Should return a new ERC20 token", async function() {
    const [owner] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('ERC20Token')
    const erc20 = await factory.deploy(INITIAL_SUPPLY, 'Defi1 Token', 'DEFI1')
    await erc20.deployed()

    expect(await erc20.totalSupply()).to.equal(INITIAL_SUPPLY)
  })
})
