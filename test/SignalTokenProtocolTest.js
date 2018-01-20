const SignalTokenProtocol = artifacts.require("SignalTokenProtocol");
const SignalToken = artifacts.require("SignalToken");


contract("SignalTokenProtocol", function(accounts) {
  let signalTokenProtocol;
  let signalToken;
  let advertiser;
  let title;
  let description;
  let contentUrl;
  let reward;
  let budget;

  beforeEach(function() {
    return SignalTokenProtocol.new()
    .then(function(instance) {
      signalTokenProtocol = instance;
      advertiser = accounts[1];
      title = "Test";
      description = "A test campaign.";
      contentUrl = "www.ethereum.org";
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
    let campaignsCountStarting;
    let campaignsCountEnding;

    return signalTokenProtocol.getCampaignsCount.call()
    .then(function(campaignsCount) {
      campaignsCountStarting = campaignsCount.toNumber();
      return signalTokenProtocol.createCampaign(
        title,
        description,
        contentUrl,
        reward,
        budget,
        { from: advertiser }
      );
    })
    .then(function() {
      return signalTokenProtocol.getCampaignsCount.call();
    })
    .then(function(campaignsCount) {
      campaignsCountEnding = campaignsCount.toNumber();
      assert.equal(
        campaignsCountEnding,
        campaignsCountStarting + 1,
        "no campaigns were created"
      );
    });
  });

  it("should create a campaign with a specified advertiser, reward, and budget", function() {
    const campaignId = 0;

    let _advertiser;
    let _title;
    let _description;
    let _contentUrl;
    let _reward;
    let _budget;

    return signalTokenProtocol.createCampaign(
      title,
      description,
      contentUrl,
      reward,
      budget,
      { from: advertiser }
    )
    .then(function() {
      return signalTokenProtocol.getCampaign(campaignId);
    })
    .then(function(campaign) {
      _advertiser = campaign[0];
      _title = campaign[1];
      _description = campaign[2];
      _contentUrl = campaign[3];
      _reward = campaign[4];
      _budget = campaign[5];

      assert.equal(_advertiser, advertiser, "campaign does not have correct advertiser");
      assert.equal(_title, title, "campaign does not have correct amount");
      assert.equal(_description, description, "campaign does not have correct limit");
      assert.equal(_contentUrl, contentUrl, "campaign does not have correct limit");
      assert.equal(_reward, reward, "campaign does not have correct amount");
      assert.equal(_budget, budget, "campaign does not have correct limit");
    });
  });
});
