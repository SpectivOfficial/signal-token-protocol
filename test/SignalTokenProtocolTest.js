const SignalTokenProtocol = artifacts.require("SignalTokenProtocol");


contract("SignalTokenProtocol", function(accounts) {
  let signalTokenProtocol;
  let advertiser;
  let publisher;
  let executor;
  let amount;

  beforeEach(function() {
    return SignalTokenProtocol.new()
    .then(function(instance) {
      signalTokenProtocol = instance;
      advertiser = accounts[0];
      publisher = accounts[1];
      executor = accounts[2];
      amount = 42;
    });
  });

  it("should pass a dummy test", function() {
    assert.equal(true, true, "the dummy test failed");
  });

  it("should allow an advertiser to create a campaign", function() {
    let numberOfCampaignsStarting;
    let numberOfCampaignsEnding;

    return signalTokenProtocol.numberOfCampaigns.call()
    .then(function(numberOfCampaigns) {
      numberOfCampaignsStarting = parseInt(numberOfCampaigns.valueOf());
      return signalTokenProtocol.createCampaign(
        advertiser,
        publisher,
        executor,
        amount,
        { from: advertiser }
      );
    })
    .then(function() {
      return signalTokenProtocol.numberOfCampaigns.call();
    })
    .then(function(numberOfCampaigns) {
      numberOfCampaignsEnding = parseInt(numberOfCampaigns.valueOf());
      assert.equal(
        numberOfCampaignsEnding,
        numberOfCampaignsStarting + 1,
        "no campaigns were created"
      );
    });
  });

  it("should create a campaign with a specified advertiser, publisher, executor, and value", function() {
    const campaignId = 0;

    let _advertiser;
    let _publisher;
    let _executor;
    let _amount;

    return signalTokenProtocol.createCampaign(
      advertiser,
      publisher,
      executor,
      amount,
      { from: advertiser }
    )
    .then(function() {
      return signalTokenProtocol.getCampaign(campaignId);
    })
    .then(function(campaign) {
      _advertiser = campaign[0];
      _publisher = campaign[1];
      _executor = campaign[2];
      _amount = campaign[3];

      assert.equal(_advertiser, advertiser, "campaign does not have correct advertiser");
      assert.equal(_publisher, publisher, "campaign does not have correct publisher");
      assert.equal(_executor, executor, "campaign does not have correct implementation");
      assert.equal(_amount, amount, "campaign does not have correct amount");
    });
  });
});
