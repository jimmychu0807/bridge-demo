// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

  // uint constant FAUCET_AMT = 1 * 10^18;

  // event FaucetForOwner(address indexed sender, uint amt);

  constructor(uint initialSupply, string memory _name, string memory _symbol) ERC20(_name, _symbol)
  {
    _mint(address(this), initialSupply);

    // Allow the deployer send fund out on behalf of this contract
    approve(msg.sender, initialSupply);
  }
}
