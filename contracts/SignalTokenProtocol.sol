pragma solidity ^0.4.4;

// import './Advertiser.sol';
import './TokenStub.sol';


contract SignalTokenProtocol {
  address public owner;

  TokenStub public token_stub;

  mapping(address => bool) private admins;

  // mapping(address => Advertiser) private advertisers;

  modifier isOwner() {
    if (msg.sender == owner) {
      _;
    }
  }

  modifier isAdmin() {
    if (admins[msg.sender]) {
      _;
    }
  }

  function SignalTokenProtocol() public {
    owner = msg.sender;
    admins[owner] = true;
    token_stub = new TokenStub(this);
  }

  function transfer(address advertiser, address publisher, uint amount) public returns (bool) {
    return token_stub.executeTransfer(advertiser, publisher, amount);
  }

  function addAdmin(address _address) public isOwner {
    admins[_address] = true;
  }

  function removeAdmin(address _address) public isOwner {
    if (_address == owner) {
      return;
    }
    admins[_address] = false;
  }

  function getAdmin(address _address) public view isAdmin returns (bool) {
    return admins[_address];
  }

  // function addAdvertiser(address addr) public isAdmin returns (address) {
  //   advertisers[addr] = new Advertiser(addr);
  //   return advertisers[addr];
  // }

  // function removeAdvertiser(address addr) public isAdmin returns (bool) {
  //   delete advertisers[addr];
  //   return true;
  // }
}
