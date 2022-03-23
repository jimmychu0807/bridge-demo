import { expect } from 'chai'
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat'

const INITIAL_SUPPLY = ethers.BigNumber.from('10000000000000000000')

const setup = deployments.createFixture(async() => {
  await deployments.fixture('ERC20Token')
  const {alith} = await getNamedAccounts()
  const erc20 = await deployments.get('ERC20Token')
  console.log(`ERC20Token deployed at: ${erc20.address}`)

  const users = await setupUsers(await getUnnamedAccounts(), erc20)
  return {
    contracts: { erc20 },
    users,
  }
})

describe('ERC20 Token', function() {
  it("should return a new ERC20 token", async function() {

    const { users } = await setup()

    const [owner, acct1] = await ethers.getSigners()
    const factory = await ethers.getContractFactory('ERC20Token')
    const erc20 = await factory.deploy(INITIAL_SUPPLY, 'Defi Token', 'DEFI')
    await erc20.deployed()

    expect(await erc20.totalSupply()).to.equal(INITIAL_SUPPLY)
  }
    // only the owner can call faucetForOwner() call
    const balance0 = await erc20.balanceOf(owner)
    expect(balance0).to.equal(0)

    await erc20.faucetForOwner({from: acct1})
  })
})
