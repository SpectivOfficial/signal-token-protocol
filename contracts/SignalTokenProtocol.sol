pragma solidity ^0.4.18;

import './SignalToken.sol';


contract SignalTokenProtocol {
  struct Campaign {
    address advertiser;
    uint reward;
    uint budget;
  }

  mapping(uint => Campaign) public campaigns;
  uint public numberOfCampaigns;

  SignalToken public signalToken;

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
    uint reward,
    uint budget
  )
    public
    returns (uint campaignId)
  {
    campaignId = numberOfCampaigns++;
    campaigns[campaignId] = Campaign(msg.sender, reward, budget);
  }

  function getCampaign(uint campaignId)
    public
    view
    returns (address advertiser,  uint reward, uint budget)
  {
    Campaign storage campaign = campaigns[campaignId];

    advertiser = campaign.advertiser;
    reward = campaign.reward;
    budget = campaign.budget;
  }

  function executeCampaign(uint campaignId, address publisher)
    public
    returns (bool)
  {
    Campaign storage campaign = campaigns[campaignId];
    return executeTransfer(campaign.advertiser, publisher, campaign.reward);
  }

  function executeTransfer(
    address advertiser,
    address publisher,
    uint reward
  )
    private
    returns (bool)
  {
    return signalToken.transferFrom(advertiser, publisher, reward);
  }
}
