// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

uint256 constant INITIAL_SUPPLY = 1000000000000000000000;

contract ERC20SwapToken is ERC20, Ownable {

  mapping(address => uint16) public exchangeRate;
  event SetExchangeRate(address indexed erc20, uint rate);
  event RemoveExchangeRate(address indexed erc20);
  event ExchangeTokens(address, uint256, address, uint256);

  constructor(address owner, string memory _name, string memory _symbol)
    ERC20(_name, _symbol) Ownable()
  {
    // Splitting half to the owner and half within the contract itself for swapping pool
    transferOwnership(owner);
    _mint(owner, INITIAL_SUPPLY/2);
    _mint(address(this), INITIAL_SUPPLY/2);
  }

  // `rate`: the denominator is 1000. If rate = 1000, then it is a 1:1 exchange,
  //         If rate = 100, 1000 of the incoming erc20 token will be exchanged for 100.
  function setExchangeRate(address erc20, uint16 rate) public onlyOwner() {
    require(rate > 0, "rate has to be bigger than zero");
    exchangeRate[erc20] = rate;
    emit SetExchangeRate(erc20, rate);
  }

  function removeExchangeRate(address erc20) public onlyOwner() {
    delete exchangeRate[erc20];
    emit RemoveExchangeRate(erc20);
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

  function enoughForExchange(address extToken, uint256 amt) public view returns (bool) {
    return _exchanged(extToken, amt) <= balanceOf(address(this));
  }

  function _exchanged(address extToken, uint256 amt) internal view returns (uint256) {
    uint256 rate = exchangeRate[extToken];
    require(rate > 0, "Exchange rate is not set for the token");
    return amt * rate / 1000;
  }
}
