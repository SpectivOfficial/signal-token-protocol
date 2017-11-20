pragma solidity ^0.4.4;


contract SignalTokenMock {
  mapping (address => uint) public balances;

  function SignalTokenMock() public {
    balances[msg.sender] = 1000000;
  }

  modifier atLeast(uint amount) {
    if (balances[msg.sender] < amount) {
      return;
    }

    _;
  }

  function getBalance(address addr) public view returns (uint) {
    return balances[addr];
  }

  function transfer(uint amount, address sender, address destination) public returns (bool) {
    balances[sender] -= amount;
    balances[destination] += amount;

    return true;
  }
}
