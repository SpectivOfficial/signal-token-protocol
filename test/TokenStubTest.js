const TokenStub = artifacts.require("TokenStub");


contract("TokenStub", function(accounts) {
  const owner = accounts[0];
  let tokenStub;

  beforeEach(function() {
    return TokenStub.new(owner)
    .then(function(instance) {
      tokenStub = instance;
    });
  });

  it("should pass a dummy test", function() {
    assert.equal(true, true, "the dummy test failed");
  });

  it("should give the deploying account 1000000 tokens", function() {
    return tokenStub.getBalance(owner)
    .then(function(balance) {
      assert.equal(
        balance.valueOf(),
        1000000,
        "1000000 wasn't the deploying account balance"
      );
    });
  });

  it("should complete a transfer if sender's balance allows", function() {
    const sender = owner;
    let senderStartingBalance;
    let senderEndingBalance;

    const recipient = accounts[1];
    let recipientStartingBalance;
    let recipientEndingBalance;

    const amount = 1000000;

    return tokenStub.getBalance(sender)
    .then(function(balance) {
      senderStartingBalance = balance.toNumber();
      return tokenStub.getBalance(recipient);
    })
    .then(function(balance) {
      recipientStartingBalance = balance.toNumber();
      return tokenStub.executeTransfer(
        sender,
        recipient,
        amount,
        { from: sender }
      );
    })
    .then(function() {
      return tokenStub.getBalance(sender);
    })
    .then(function(balance) {
      senderEndingBalance = balance.toNumber();
      return tokenStub.getBalance(recipient);
    })
    .then(function(balance) {
      recipientEndingBalance = balance.toNumber();

      assert.equal(
        senderEndingBalance,
        senderStartingBalance - amount,
        "0 wasn't the sender account final balance"
      );

      assert.equal(
        recipientEndingBalance,
        recipientStartingBalance + amount,
        "1000000 wasn't the destination account final balance"
      );
    });
  });

  it("should revert a transfer if sender's balance disallows", function() {
    const sender = owner;
    let senderStartingBalance;
    let senderEndingBalance;

    const recipient = accounts[1];
    let recipientStartingBalance;
    let recipientTwoEndingBalance;

    const amount = 1000001;

    return tokenStub.getBalance(sender)
    .then(function(balance) {
      senderStartingBalance = balance.toNumber();
      return tokenStub.getBalance(recipient);
    })
    .then(function(balance) {
      recipientStartingBalance = balance.toNumber();
      return tokenStub.executeTransfer(
        sender,
        recipient,
        amount,
        { from: sender }
      );
    })
    .then(function() {
      return tokenStub.getBalance(sender);
    })
    .then(function(balance) {
      senderEndingBalance = balance.toNumber();
      return tokenStub.getBalance(recipient);
    })
    .then(function(balance) {
      recipientEndingBalance = balance.toNumber();

      assert.equal(
        senderEndingBalance,
        senderStartingBalance,
        "1000000 wasn't the deploying account final balance"
      );
      assert.equal(
        recipientEndingBalance,
        recipientStartingBalance,
        "0 wasn't the destination account final balance"
      );
    });
  });
});
