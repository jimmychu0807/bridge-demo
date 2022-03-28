// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract ERC20SwapToken is ERC20PresetMinterPauser{
  constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {}
}
