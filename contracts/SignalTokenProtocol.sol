pragma solidity ^0.4.18;

import './TokenStub.sol';


contract SignalTokenProtocol {
  struct Campaign {
    address advertiser;
    address publisher;
    uint amount;
  }

  address public owner;
  mapping(address => bool) private admins;
  mapping(uint => Campaign) private campaigns;

  TokenStub public token_stub;


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

  function executeCampaign(uint campaignId) public isOwner returns (bool) {
    Campaign storage campaign = campaigns[campaignId];
    return transfer(campaign.advertiser, campaign.publisher, campaign.amount);
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
}
