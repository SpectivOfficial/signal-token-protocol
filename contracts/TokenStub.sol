pragma solidity ^0.4.4;


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

  function getBalance(address _address) public view returns (uint) {
    return balances[_address];
  }

  function executeTransfer(address advertiser, address publisher, uint amount)
    public
    isOwner
    returns (bool)
  {
    return transfer(advertiser, publisher, amount);
  }

  function transfer(address advertiser, address publisher, uint amount)
    private
    atLeast(advertiser, amount)
    returns (bool)
  {
    balances[advertiser] -= amount;
    balances[publisher] += amount;

    return true;
  }
}
