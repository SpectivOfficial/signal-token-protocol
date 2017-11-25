pragma solidity ^0.4.18;

import './TokenStub.sol';


contract SignalTokenProtocol {
  struct Campaign {
    address advertiser;
    address publisher;
    address executor;
    uint amount;
  }

  mapping(uint => Campaign) public campaigns;
  uint public numberOfCampaigns;

  TokenStub public tokenStub;

  modifier isExecutor(uint campaignId) {
    Campaign storage campaign = campaigns[campaignId];

    if (msg.sender == campaign.executor) {
      _;
    }
  }

  function SignalTokenProtocol() public {
    numberOfCampaigns = 0;
    tokenStub = new TokenStub(this);
  }

  function createCampaign(
    address advertiser,
    address publisher,
    address executor,
    uint amount
  )
    public
    returns (uint campaignId)
  {
    campaignId = numberOfCampaigns;
    numberOfCampaigns++;

    campaigns[campaignId] = Campaign(advertiser, publisher, executor, amount);
  }

  function getCampaign(uint campaignId)
    public
    view
    returns (address advertiser, address publisher, address executor, uint amount)
  {
    Campaign storage campaign = campaigns[campaignId];

    advertiser = campaign.advertiser;
    publisher = campaign.publisher;
    executor = campaign.executor;
    amount = campaign.amount;
  }

  function executeCampaign(uint campaignId)
    public
    isExecutor(campaignId)
    returns (bool)
  {
    Campaign storage campaign = campaigns[campaignId];
    return executeTransfer(campaign.advertiser, campaign.publisher, campaign.amount);
  }

  function executeTransfer(
    address advertiser,
    address publisher,
    uint amount
  )
    private
    returns (bool)
  {
    return tokenStub.executeTransfer(advertiser, publisher, amount);
  }
}
