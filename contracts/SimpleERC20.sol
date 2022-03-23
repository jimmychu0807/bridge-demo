// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./libraries/ERC20Base.sol";

contract SimpleERC20 is ERC20Base {
  string public constant SYMBOL = "SIMPLE";
  string public constant NAME = "Simple ERC20";

  constructor(address to, uint amount) {
    _mint(to, amount);
  }

  function name() public pure override returns (string memory) {
    return NAME;
  }
}
