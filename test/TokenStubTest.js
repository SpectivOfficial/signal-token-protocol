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
    const accountOne = owner;
    let accountOneStartingBalance;
    let accountOneEndingBalance;

    const accountTwo = accounts[1];
    let accountTwoStartingBalance;
    let accountTwoEndingBalance;

    const amount = 1000000;

    return tokenStub.getBalance(accountOne)
      .then(function(balance) {
        accountOneStartingBalance = balance.toNumber();
        return tokenStub.getBalance(accountTwo);
      })
      .then(function(balance) {
        accountTwoStartingBalance = balance.toNumber();
        return tokenStub.executeTransfer(
          accountOne,
          accountTwo,
          amount,
          { from: owner }
        );
      })
      .then(function() {
        return tokenStub.getBalance(accountOne);
      })
      .then(function(balance) {
        accountOneEndingBalance = balance.toNumber();
        return tokenStub.getBalance(accountTwo);
      })
      .then(function(balance) {
        accountTwoEndingBalance = balance.toNumber();

        assert.equal(
          accountOneEndingBalance,
          accountOneStartingBalance - amount,
          "0 wasn't the sender account final balance"
        );

        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance + amount,
          "1000000 wasn't the destination account final balance"
        );
      });
  });


  it("should revert a transfer if sender's balance disallows", function() {
    const accountOne = owner;
    let accountOneStartingBalance;
    let accountOneEndingBalance;

    const accountTwo = accounts[1];
    let accountTwoStartingBalance;
    let accountTwoEndingBalance;

    const amount = 1000001;

    return tokenStub.getBalance(accountOne)
      .then(function(balance) {
        accountOneStartingBalance = balance.toNumber();
        return tokenStub.getBalance(accountTwo);
      })
      .then(function(balance) {
        accountTwoStartingBalance = balance.toNumber();
        return tokenStub.executeTransfer(
          accountOne,
          accountTwo,
          amount,
          { from: owner }
        );
      })
      .then(function() {
        return tokenStub.getBalance(accountOne);
      })
      .then(function(balance) {
        accountOneEndingBalance = balance.toNumber();
        return tokenStub.getBalance(accountTwo);
      })
      .then(function(balance) {
        accountTwoEndingBalance = balance.toNumber();

        assert.equal(
          accountOneEndingBalance,
          accountOneStartingBalance,
          "1000000 wasn't the deploying account final balance"
        );
        assert.equal(
          accountTwoEndingBalance,
          accountTwoStartingBalance,
          "0 wasn't the destination account final balance"
        );
      });
  });
});
