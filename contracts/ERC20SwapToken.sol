// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ERC20SwapToken is ERC20 {

  mapping(address => uint16) public exchangeRate;
  event SetExchangeRate(address indexed erc20, uint rate);
  event ExchangeTokens(address, uint256, address, uint256);

  constructor(uint initialSupply, address owner, string memory _name, string memory _symbol)
    ERC20(_name, _symbol)
  {
    // Splitting half to the owner and half within the contract itself for swapping pool
    _mint(owner, initialSupply/2);
    _mint(address(this), initialSupply/2);
  }

  // `rate`: the denominator is 1000. If rate = 1000, then it is a 1:1 exchange,
  //         If rate = 100, 1000 of the incoming erc20 token will be exchanged for 100.
  function setExchangeRate(address erc20, uint16 rate) public {
    require(rate > 0, "rate has to be bigger than zero");
    exchangeRate[erc20] = rate;
    emit SetExchangeRate(erc20, rate);
  }

  function exchange(address erc20, uint256 amt) public {
    require(
      ERC20SwapToken(erc20).enoughForExchange(address(this), amt),
      "Not enough balance from the target token swapping pool"
    );

    transfer(erc20, amt);
    uint256 exchangedAmt = ERC20SwapToken(erc20).exchangeFor(msg.sender, address(this), amt);
    emit ExchangeTokens(erc20, amt, address(this), exchangedAmt);
  }

  function exchangeFor(address user, address extToken, uint256 amt) public returns (uint256) {
    uint256 exchanged = _exchanged(extToken, amt);
    _approve(address(this), msg.sender, exchanged);
    transferFrom(address(this), user, exchanged);
    return exchanged;
  }

  function enoughForExchange(address extToken, uint256 amt) public returns (bool) {
    return _exchanged(extToken, amt) <= balanceOf(address(this));
  }

  function _exchanged(address extToken, uint256 amt) internal returns (uint256) {
    // TODO: calc the exchange rate later
    return amt;
  }
}