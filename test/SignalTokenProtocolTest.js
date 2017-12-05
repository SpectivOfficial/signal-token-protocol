const SignalTokenProtocol = artifacts.require("SignalTokenProtocol");
const SignalToken = artifacts.require("SignalToken");


contract("SignalTokenProtocol", function(accounts) {
  let signalTokenProtocol;
  let signalToken;
  let advertiser;
  let publisher;
  let executor;
  let amount;
  let limit;

  beforeEach(function() {
    return SignalTokenProtocol.new()
    .then(function(instance) {
      signalTokenProtocol = instance;
      advertiser = accounts[1];
      publisher = accounts[2];
      executor = accounts[3];
      amount = 42;
      limit = 420;
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
        publisher,
        executor,
        amount,
        limit,
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

  it("should create a campaign with a specified advertiser, publisher, executor, and value", function() {
    const campaignId = 0;

    let _advertiser;
    let _publisher;
    let _executor;
    let _amount;

    return signalTokenProtocol.createCampaign(
      publisher,
      executor,
      amount,
      limit,
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
      _limit = campaign[4];

      assert.equal(_advertiser, advertiser, "campaign does not have correct advertiser");
      assert.equal(_publisher, publisher, "campaign does not have correct publisher");
      assert.equal(_executor, executor, "campaign does not have correct implementation");
      assert.equal(_amount, amount, "campaign does not have correct amount");
      assert.equal(_limit, limit, "campaign does not have correct limit");
    });
  });

  it("should allow an executor to execute a campaign", function () {
    const campaignId = 0;

    let advertiserStartingBalance;
    let advertiserEndingBalance;

    let publisherStartingBalance;
    let publisherEndingBalance;

    let executorStartingBalance;
    let executorEndingBalance;

    let _advertiser;
    let _publisher;
    let _executor;
    let _amount;
    let _limit;

    return signalTokenProtocol.faucet({ from: advertiser })
    .then(function() {
      return signalToken.balanceOf(advertiser);
    })
    .then(function(balance) {
      advertiserStartingBalance = balance.toNumber();
      return signalToken.balanceOf(publisher);
    })
    .then(function(balance) {
      publisherStartingBalance = balance.toNumber();
      return signalToken.balanceOf(executor);
    })
    .then(function(balance) {
      executorStartingBalance = balance.toNumber();
      return signalToken.approve(
        signalTokenProtocol.address,
        limit,
        { from: advertiser }
      );
    })
    .then(function() {
      return signalTokenProtocol.createCampaign(
        publisher,
        executor,
        amount,
        limit,
        { from: advertiser }
      );
    })
    .then(function() {
      return signalTokenProtocol.getCampaign(campaignId);
    })
    .then(function(campaign) {
      _advertiser = campaign[0];
      _publisher = campaign[1];
      _executor = campaign[2];
      _amount = campaign[3];
      _limit = campaign[4];

      return signalTokenProtocol.executeCampaign(campaignId, { from: executor });
    })
    .then(function() {
      return signalToken.balanceOf(_advertiser);
    })
    .then(function(balance) {
      advertiserEndingBalance = balance.toNumber();
      return signalToken.balanceOf(_publisher);
    })
    .then(function(balance) {
      publisherEndingBalance = balance.toNumber();
      return signalToken.balanceOf(_executor);
    })
    .then(function(balance) {
      executorEndingBalance = balance.toNumber();

      assert.equal(
        advertiserEndingBalance,
        advertiserStartingBalance - _amount,
        "advertiser ending balance is not the expected result after campaign execution"
      );
      assert.equal(
        publisherEndingBalance,
        publisherStartingBalance + _amount,
        "advertiser ending balance is not the expected result after campaign execution"
      );
      assert.equal(
        executorEndingBalance,
        executorStartingBalance,
        "advertiser ending balance is not the expected result after campaign execution"
      );
    });
  });
});
