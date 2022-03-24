import {expect} from 'chai'
import { ethers, deployments, getNamedAccounts } from 'hardhat'

describe("SimpleERC20 contract", function() {
  it("Deployment should assign the total supply of tokens to the owner", async function() {
    // deploy the contract with this line
    await deployments.fixture(['erc20'])

    const {tokenOwner} = await getNamedAccounts();
    const erc20 = await ethers.getContract('SimpleERC20')
    const ownerBalance = await erc20.balanceOf(tokenOwner)
    const supply = await erc20.totalSupply()
    expect(ownerBalance).to.equal(supply)
  })
})
