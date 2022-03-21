// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {

  uint constant FAUCET_AMT = 10 * 10^18;

  event FaucetForOwner(address indexed sender, uint amt);

  constructor(uint initialSupply, string memory _name, string memory _symbol)
    ERC20(_name, _symbol)
  {
    _mint(address(this), initialSupply);
  }

  function faucetForOwner() public onlyOwner {
    transfer(msg.sender, FAUCET_AMT);
    emit FaucetForOwner(msg.sender, FAUCET_AMT);
  }
}
