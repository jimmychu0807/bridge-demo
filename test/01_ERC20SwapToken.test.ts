import { expect } from 'chai'
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat'



describe('ERC20 Token', function() {
  it("should return a new ERC20 token", async function() {
    await deployments.fixture(['erc20'])
    const {deployer, tokenOwner} = await getNamedAccounts()
    const defi1 = await ethers.getContract('Defi1Deployment', deployer)

    expect(await defi1.name()).to.equal('Swap Demo Token 1')

    const totalSupply = await defi1.totalSupply()
    const ownerOwned = ethers.BigNumber.from(await defi1.balanceOf(tokenOwner))
    const contractOwned = ethers.BigNumber.from(await defi1.balanceOf(defi1.address))

    expect(ownerOwned.add(contractOwned)).to.equal(totalSupply)
  })

  it("should allow for tokens exchange", async function() {
    await deployments.fixture(['erc20'])
    const {deployer, tokenOwner, alith } = await getNamedAccounts()

    // You have to use UnnamedAccounts, otherwise the acct doesn't even have the native token to send transaction.
    const user = (await getUnnamedAccounts())[0]

    const tokenOwner_defi1 = await ethers.getContract('Defi1Deployment', tokenOwner)
    const tokenOwner_defi2 = await ethers.getContract('Defi2Deployment', tokenOwner)
    const user_defi1 = await ethers.getContract('Defi1Deployment', user)
    const user_defi2 = await ethers.getContract('Defi2Deployment', user)
    // Set the exchange rate: 1 DEFI1 = 2 DEFI2
    const X_BASIS = 1000
    const rate = 2
    await tokenOwner_defi2.setExchangeRate(tokenOwner_defi1.address, X_BASIS * rate)
    await tokenOwner_defi1.setExchangeRate(tokenOwner_defi2.address, X_BASIS / rate)

    const exchangeAmt = 100000
    await tokenOwner_defi1.transfer(user, exchangeAmt)

    expect(await user_defi1.balanceOf(user)).to.equal(exchangeAmt)
    expect(await user_defi2.balanceOf(user)).to.equal(0)

    const exchanged = await user_defi1.exchange(user_defi2.address, exchangeAmt);

    // successfully exchanged
    expect(await user_defi1.balanceOf(user)).to.equal(0)
    expect(await user_defi2.balanceOf(user)).to.equal(exchangeAmt * rate)
  })
})
