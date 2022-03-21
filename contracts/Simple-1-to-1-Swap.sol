// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Simple1To1Swap {

  address public token1Addr;
  address public token2Addr;
  uint public ratioInThousand; // Between 1 - 1000

  // The swapping formula:
  //   token2 amt = token1 amt * ratioInThousand / 1000

  event SwapFrom(address indexed sender, address, uint);
  event SwapTo(address indexed sender, address, uint);

  constructor(address _token1Addr, address _token2Addr, uint _ratioInThousand) {
    require(_token1Addr != _token2Addr, "token1 address cannot be the same as the token2 address.");
    require(
      _ratioInThousand >= 1 && _ratioInThousand <= 1000,
      "ratioInThousand must be within 1 - 1000 inclusive."
    );

    token1Addr = _token1Addr;
    token2Addr = _token2Addr;
    ratioInThousand = _ratioInThousand;
  }

  function swap(address fromTokenAddr, address toTokenAddr, uint fromAmt) public {
    require(
      IERC20(fromTokenAddr).balanceOf(msg.sender) >= fromAmt,
      "Insufficient tokens to swap from"
    );
    require(
      fromTokenAddr == token1Addr || fromTokenAddr == token2Addr,
      "fromTokenAddr not recognized"
    );
    require(
      toTokenAddr == token1Addr || toTokenAddr == token2Addr,
      "toTokenAddr not recognized"
    );

    uint toAmt = _getEquivalence(fromTokenAddr, toTokenAddr, fromAmt);
    IERC20(fromTokenAddr).transferFrom(msg.sender, fromTokenAddr, fromAmt);
    IERC20(toTokenAddr).transferFrom(toTokenAddr, msg.sender, toAmt);

    emit SwapFrom(msg.sender, fromTokenAddr, fromAmt);
    emit SwapTo(msg.sender, toTokenAddr, toAmt);
  }

  function _getEquivalence(
    address fromTokenAddr,
    address toTokenAddr,
    uint fromAmt
  ) internal view returns (uint) {
    assert(fromTokenAddr == token1Addr || fromTokenAddr == token2Addr);
    assert(toTokenAddr == token1Addr || toTokenAddr == token2Addr);

    if (fromTokenAddr == toTokenAddr) {
      return fromAmt;
    } else if (fromTokenAddr == token1Addr) {
      return fromAmt * ratioInThousand / 1000;
    }
    return fromAmt * 1000 / ratioInThousand;
  }
}
