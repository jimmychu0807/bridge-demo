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
  await defi1.transfer(aAddr, ethers.constants.WeiPerEther.mul(10))
  await defi2.transfer(bAddr, ethers.constants.WeiPerEther.mul(20))

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
    defi2: await ethers.getContract('Defi2Deployment', bAddr),
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

    // Alice places an order
    await alice.defi1.increaseAllowance(alice.orderBook.address, bidAmt)
    const txReceipt = await alice.orderBook.placeOrder(deployer.defi1.address, bidAmt, deployer.defi2.address, askAmt)

    // test: the new order should be created
    const ind = txReceipt.value.toNumber()
    const newOrder = await alice.orderBook.orders(ind)
    expect(newOrder.tokenBid).to.equal(deployer.defi1.address)
    expect(newOrder.bidAmt).to.equal(bidAmt)
    expect(newOrder.tokenAsk).to.equal(deployer.defi2.address)
    expect(newOrder.askAmt).to.equal(askAmt)
    expect(newOrder.maker).to.equal(alice.address)
    expect(newOrder.status).to.equal(0)

    // test: allowance increased
    const allowance = await deployer.defi1.allowance(alice.address, alice.orderBook.address)
    expect(allowance).to.equal(bidAmt)
  })

  it('should allow user to cancel an order', async function() {
    const { deployer, alice, bob } = await setup()
    const bidAmt = ETHER_UNIT.mul(1)
    const askAmt = ETHER_UNIT.mul(2)

    await alice.defi1.increaseAllowance(alice.orderBook.address, bidAmt)
    const txReceipt = await alice.orderBook.placeOrder(deployer.defi1.address, bidAmt, deployer.defi2.address, askAmt)

    const ind = txReceipt.value.toNumber()
    // Alice cancels the order
    await alice.orderBook.cancelOrder(ind)
    await alice.defi1.decreaseAllowance(alice.orderBook.address, bidAmt)

    const newOrder = await alice.orderBook.orders(ind)
    expect(newOrder.status).to.equal(2)
    const allowance = await deployer.defi1.allowance(alice.address, alice.orderBook.address)
    expect(allowance).to.equal(0)
  })

  it('should allow another user to take an order and actually transfer', async function() {
    const { deployer, alice, bob } = await setup()
    const bidAmt = ETHER_UNIT.mul(1)
    const askAmt = ETHER_UNIT.mul(2)

    const aliceDefi1BalanceBefore = await deployer.defi1.balanceOf(alice.address)
    const aliceDefi2BalanceBefore = await deployer.defi2.balanceOf(alice.address)
    const bobDefi1BalanceBefore   = await deployer.defi1.balanceOf(bob.address)
    const bobDefi2BalanceBefore   = await deployer.defi2.balanceOf(bob.address)

    // Alice places an order
    await alice.defi1.increaseAllowance(alice.orderBook.address, bidAmt)
    const txReceipt = await alice.orderBook.placeOrder(deployer.defi1.address, bidAmt, deployer.defi2.address, askAmt)

    // Bob takes the order
    const ind = txReceipt.value
    await bob.defi2.increaseAllowance(bob.orderBook.address, askAmt)
    await bob.orderBook.takeOrder(ind)

    // The order status should be executed
    const newOrder = await alice.orderBook.orders(ind)
    expect(newOrder.status).to.equal(1)

    const aliceDefi1BalanceAfter = await deployer.defi1.balanceOf(alice.address)
    const aliceDefi2BalanceAfter = await deployer.defi2.balanceOf(alice.address)
    const bobDefi1BalanceAfter   = await deployer.defi1.balanceOf(bob.address)
    const bobDefi2BalanceAfter   = await deployer.defi2.balanceOf(bob.address)

    // Check all balances should be set correctly
    expect(aliceDefi1BalanceBefore.sub(aliceDefi1BalanceAfter)).to.equal(bidAmt)
    expect(aliceDefi2BalanceAfter.sub(aliceDefi2BalanceBefore)).to.equal(askAmt)
    expect(bobDefi1BalanceAfter.sub(bobDefi1BalanceBefore)).to.equal(bidAmt)
    expect(bobDefi2BalanceBefore.sub(bobDefi2BalanceAfter)).to.equal(askAmt)

    // Alice and Bob allowance should be 0 now
    expect(await alice.defi1.allowance(alice.address, deployer.orderBook.address)).to.equal(0)
    expect(await bob.defi2.allowance(bob.address, deployer.orderBook.address)).to.equal(0)
  })
})
