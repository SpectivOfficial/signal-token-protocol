const SignalTokenProtocol = artifacts.require("SignalTokenProtocol");
const SignalToken = artifacts.require("SignalToken");


contract("SignalTokenProtocol", function(accounts) {
  let signalTokenProtocol;
  let signalToken;
  let advertiser;
  let reward;
  let budget;

  beforeEach(function() {
    return SignalTokenProtocol.new()
    .then(function(instance) {
      signalTokenProtocol = instance;
      advertiser = accounts[1];
      reward = 42;
      budget = 420;
      return signalTokenProtocol.signalToken();
    })
    .then(function(signalTokenAddress) {
      signalToken = SignalToken.at(signalTokenAddress);
    });
  });

  it("should pass a dummy test", function() {
    assert.equal(true, true, "the dummy test failed");
  });

  it("should allow public access to faucet signal tokens", function() {
    const faucetAmount = 500000;

    const recipient = accounts[1];
    let recipientStartingBalance;
    let recipientEndingBalance;

    return signalToken.balanceOf(recipient)
    .then(function(balance) {
      recipientStartingBalance = balance.toNumber();
      return signalTokenProtocol.faucet({ from: recipient });
    })
    .then(function(transfer) {
      return signalToken.balanceOf(recipient);
    })
    .then(function(balance) {
      recipientEndingBalance = balance.toNumber();

      assert.equal(
        recipientEndingBalance,
        recipientStartingBalance + 500000,
        "the recipient's account balance was not increased by 500,000"
      );
    });
  });

  it("should allow an advertiser to create a campaign", function() {
    let numberOfCampaignsStarting;
    let numberOfCampaignsEnding;

    return signalTokenProtocol.numberOfCampaigns.call()
    .then(function(numberOfCampaigns) {
      numberOfCampaignsStarting = numberOfCampaigns.toNumber();
      return signalTokenProtocol.createCampaign(
        reward,
        budget,
        { from: advertiser }
      );
    })
    .then(function() {
      return signalTokenProtocol.numberOfCampaigns.call();
    })
    .then(function(numberOfCampaigns) {
      numberOfCampaignsEnding = numberOfCampaigns.toNumber();
      assert.equal(
        numberOfCampaignsEnding,
        numberOfCampaignsStarting + 1,
        "no campaigns were created"
      );
    });
  });

  it("should create a campaign with a specified advertiser, reward, and budget", function() {
    const campaignId = 0;

    let _advertiser;
    let _reward;
    let _budget;

    return signalTokenProtocol.createCampaign(
      reward,
      budget,
      { from: advertiser }
    )
    .then(function() {
      return signalTokenProtocol.getCampaign(campaignId);
    })
    .then(function(campaign) {
      _advertiser = campaign[0];
      _reward = campaign[1];
      _budget = campaign[2];

      assert.equal(_advertiser, advertiser, "campaign does not have correct advertiser");
      assert.equal(_reward, reward, "campaign does not have correct amount");
      assert.equal(_budget, budget, "campaign does not have correct limit");
    });
  });
});
