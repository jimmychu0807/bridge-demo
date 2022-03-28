import { expect } from 'chai'
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat'

const ETHER_UNIT = ethers.constants.WeiPerEther

async function setup() {
  // transfer DEFI1 and DEFI2 to Baltathar and Charleth
  await deployments.fixture(['order_book'])
  let { deployer: dAddr, alice: aAddr, bob: bAddr } = await getNamedAccounts()
  const defi1 = await ethers.getContract('Defi1Deployment', dAddr)
  const defi2 = await ethers.getContract('Defi2Deployment', dAddr)

  // Initialize Baltathar has 10 DEFI1 tokens, and Charleth has 20 DEFI2 tokens
  defi1.transfer(aAddr, ethers.constants.WeiPerEther.mul(10))
  defi2.transfer(bAddr, ethers.constants.WeiPerEther.mul(20))
  const deployer = {
    address: dAddr,
    defi1,
    defi2,
    orderBook: await ethers.getContract('OrderBook', dAddr),
  }
  const alice = {
    address: aAddr,
    defi1: await ethers.getContract('Defi1Deployment', aAddr),
    orderBook: await ethers.getContract('OrderBook', aAddr),
  }
  const bob = {
    address: bAddr,
    orderBook: await ethers.getContract('OrderBook', bAddr),
  }
  return {
    deployer,
    alice,
    bob
  }
}

describe('OrderBook', function() {
  it('should allow user to place an order', async function() {
    const { deployer, alice, bob } = await setup()
    const bidAmt = ETHER_UNIT.mul(1)
    const askAmt = ETHER_UNIT.mul(2)

    await alice.defi1.increaseAllowance(alice.orderBook.address, ETHER_UNIT.mul(1))
    await alice.orderBook.placeOrder(deployer.defi1.address, bidAmt, deployer.defi2.address, askAmt)

    // A new order should be created
    const newOrder = await alice.orderBook.orders(0)
    expect(newOrder.tokenBid).to.equal(deployer.defi1.address)
    expect(newOrder.bidAmt).to.equal(bidAmt)
    expect(newOrder.tokenAsk).to.equal(deployer.defi2.address)
    expect(newOrder.askAmt).to.equal(askAmt)
    expect(newOrder.maker).to.equal(alice.address)
    expect(newOrder.status).to.equal(0)

    const allowance = await deployer.defi1.allowance(alice.address, alice.orderBook.address)
    expect(allowance).to.equal(bidAmt)
  })

  it('should allow user to cancel an order', async function() {

  })

  it('should allow another user to place an order', async function() {

  })
})
