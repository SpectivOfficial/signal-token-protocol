pragma solidity ^0.4.4;


contract SignalTokenMock {
  mapping (address => uint) public balances;

  function SignalTokenMock() public {
    balances[msg.sender] = 1000000;
  }

  modifier atLeast(uint amount) {
    if (balances[msg.sender] < amount) {
      revert();
    }

    _;
  }

  function getBalance(address addr) public view returns (uint) {
    return balances[addr];
  }

  function transfer(uint amount, address destination) public atLeast(amount) {
    balances[msg.sender] -= amount;
    balances[destination] += amount;
  }
}
