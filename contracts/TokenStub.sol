pragma solidity ^0.4.18;


contract TokenStub {
  address public owner;
  mapping (address => uint) public balances;

  modifier isOwner() {
    if (msg.sender == owner) {
      _;
    }
  }

  modifier atLeast(address sender, uint amount) {
    if (balances[sender] >= amount) {
      _;
    }
  }

  function TokenStub(address _owner) public {
    owner = _owner;
    balances[owner] = 1000000;
  }

  function getBalance(address _address)
    public
    view
    returns (uint)
  {
    return balances[_address];
  }

  function executeTransfer(
    address sender,
    address recipient,
    uint amount
  )
    public
    isOwner
    returns (bool)
  {
    return transfer(sender, recipient, amount);
  }

  function transfer(
    address sender,
    address recipient,
    uint amount
  )
    private
    atLeast(sender, amount)
    returns (bool)
  {
    balances[sender] -= amount;
    balances[recipient] += amount;

    return true;
  }
}
