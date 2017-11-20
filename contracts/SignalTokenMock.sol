pragma solidity ^0.4.4;


contract SignalTokenMock {
  mapping (address => uint) public balances;

  function SignalTokenMock() public {
    balances[msg.sender] = 1000000;
  }

  modifier atLeast(address sender, uint amount) {
    if (balances[sender] >= amount) {
      _;
    }
  }

  function getBalance(address addr)
    public
    view
    returns (uint)
  {
    return balances[addr];
  }

  function transfer(uint amount, address sender, address destination)
    public
    atLeast(sender, amount)
    returns (bool)
  {
    balances[sender] -= amount;
    balances[destination] += amount;

    return true;
  }
}
