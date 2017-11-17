pragma solidity ^0.4.4;


contract SignalTokenMock {
  mapping (address => uint) public balances;

  function SignalTokenMock() {
    balances[msg.sender] = 1000000;
  }

  modifier atLeast(uint amount) {
    if (balances[msg.sender] < amount) {
      throw;
    }

    _;
  }

  function transfer(uint amount, address destination) atLeast(amount) {
    balances[msg.sender] -= amount;
    balances[destination] += amount;
  }
}
