// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OrderBook {
  enum Status {
    Active,
    Completed,
    Cancelled
  }

  struct Order {
    address maker;
    address tokenBid;
    uint256 bidAmt;
    address tokenAsk;
    uint256 askAmt;

    address taker;
    Status  status;
    uint256 timestamp;
  }

  Order[] public orders;

  event OrderPlaced(address indexed, uint256, address, uint256, address, uint256);
  event OrderCancelled(uint256);
  event OrderExecuted(address indexed, uint256);

  function placeOrder(address tokenBid, uint256 bidAmt, address tokenAsk, uint256 askAmt) public {
    // TODO: check the tokenBid and tokenAsk fulfill the

    require(IERC20(tokenBid).balanceOf(msg.sender) >= bidAmt, "Insufficient bid token");

    // Place the order
    // solhint-disable-next-line not-rely-on-time
    Order memory newOrder = Order(msg.sender, tokenBid, bidAmt, tokenAsk, askAmt, address(0), Status.Active, block.timestamp);
    orders.push(newOrder);
    uint256 index = orders.length - 1;

    // Approve this contract to spend your token
    IERC20(tokenBid).approve(address(this), bidAmt);
    emit OrderPlaced(msg.sender, index, tokenBid, bidAmt, tokenAsk, askAmt);
  }

  function cancelOrder(uint256 index) public {
    // check
    require(index < orders.length, "Invalid index");
    Order storage order = orders[index];
    require(order.status == Status.Active, "Not an active order");
    require(order.maker == msg.sender, "Not order owner");

    order.status = Status.Cancelled;
    // solhint-disable-next-line not-rely-on-time
    order.timestamp = block.timestamp;
    emit OrderCancelled(index);
  }

  function takeOrder(uint256 index) public {
    // check
    require(index < orders.length, "Invalid index");
    Order storage order = orders[index];
    require(order.status == Status.Active, "Not an active order");
    require(IERC20(order.tokenAsk).balanceOf(msg.sender) >= order.askAmt, "Insufficient ask token");

    IERC20(order.tokenAsk).approve(address(this), order.askAmt);

    // The actual token transfer
    IERC20(order.tokenBid).transferFrom(order.maker, msg.sender, order.bidAmt);
    IERC20(order.tokenAsk).transferFrom(msg.sender, order.maker, order.askAmt);

    order.status = Status.Completed;
    order.taker = msg.sender;
    // solhint-disable-next-line not-rely-on-time
    order.timestamp = block.timestamp;
    emit OrderExecuted(msg.sender, index);
  }
}
