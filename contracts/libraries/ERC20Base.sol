// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./Constants.sol";

abstract contract ERC20Internal {
  function _approveFor(address owner, address target, uint256 amount) internal virtual;
  function name() public virtual returns (string memory);
  function _mint(address to, uint256 amount) internal virtual;
  function _burnFrom(address from, uint256 amount) internal virtual;
}

abstract contract ERC20Base is IERC20, ERC20Internal {
  using Address for address;

  uint256 public totalSupply;
  mapping(address => uint256) internal balances;
  mapping(address => mapping(address => uint256)) internal allowances;

  function burn(uint256 amount) external virtual {
    _burnFrom(msg.sender, amount);
  }

  function balanceOf(address owner) external view override returns (uint256) {
    return balances[owner];
  }

  function allowance(address owner, address spender) external view override returns (uint256) {
    if (owner == address(this)) {
      return Constants.UINT256_MAX;
    }
    return allowances[owner][spender];
  }

  function _mint(address to, uint256 amount) internal virtual override {
    balances[to] += amount;
    totalSupply += amount;
  }

  function _approveFor(address owner, address target, uint256 amount) internal virtual override {
    allowances[owner][target] += amount;
  }

  function _burnFrom(address from, uint256 amount) internal virtual override {
    require(balances[from] >= amount, "Not enough balance");
    balances[from] -= amount;
    totalSupply -= amount;
    emit Transfer(from, address(0), amount);
  }

  function approve(address spender, uint256 amount) external virtual override returns (bool) {
    allowances[msg.sender][spender] += amount;
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) external virtual override returns (bool) {
    require(balances[from] >= amount, "Not enough balance");
    balances[from] -= amount;
    balances[to] += amount;
    return true;
  }

  function transfer(address to, uint256 amount) external virtual override returns (bool) {
    address from = msg.sender;
    require(balances[from] >= amount, "Not enough balance");

    balances[from] -= amount;
    balances[to] += amount;
    return true;
  }
}
