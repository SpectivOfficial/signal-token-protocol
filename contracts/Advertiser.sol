pragma solidity ^0.4.4;


contract Advertiser {
  address advertiser;

  mapping(address => bool) private campaigns;

  function Advertiser(address addr) public {
    advertiser = addr;
  }

  modifier isAdvertiser() {
    if (msg.sender == advertiser) {
      _;
    }
  }

  function getCampaign(address addr) public view isAdvertiser returns (bool) {
    return campaigns[addr];
  }

  function addCampaign(address addr) public isAdvertiser {
    campaigns[addr] = true;
  }

  function removeCampaign(address addr) public isAdvertiser {
    campaigns[addr] = false;
  }
}
