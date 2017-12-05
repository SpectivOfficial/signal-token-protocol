pragma solidity ^0.4.18;

import './SignalToken.sol';


contract SignalTokenProtocol {
  struct Campaign {
    address advertiser;
    address publisher;
    address executor;
    uint amount;
    uint limit;
  }

  mapping(uint => Campaign) public campaigns;
  uint public numberOfCampaigns;

  SignalToken public signalToken;

  modifier isExecutor(uint campaignId) {
    Campaign storage campaign = campaigns[campaignId];

    if (msg.sender == campaign.executor) {
      _;
    }
  }

  function SignalTokenProtocol() public {
    numberOfCampaigns = 0;
    signalToken = new SignalToken(this);
  }

  function faucet()
    public
    returns (bool)
  {
    return signalToken.mint(msg.sender, 500000);
  }

  function createCampaign(
    address publisher,
    address executor,
    uint amount,
    uint limit
  )
    public
    returns (uint campaignId)
  {
    campaignId = numberOfCampaigns++;
    campaigns[campaignId] = Campaign(msg.sender, publisher, executor, amount, limit);
  }

  function getCampaign(uint campaignId)
    public
    view
    returns (address advertiser, address publisher, address executor, uint amount, uint limit)
  {
    Campaign storage campaign = campaigns[campaignId];

    advertiser = campaign.advertiser;
    publisher = campaign.publisher;
    executor = campaign.executor;
    amount = campaign.amount;
    limit = campaign.limit;
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
    return signalToken.transferFrom(advertiser, publisher, amount);
  }
}
