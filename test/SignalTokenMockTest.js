var SignalTokenMock = artifacts.require("SignalTokenMock");


contract("SignalTokenMock", function(balances) {
  it("should give the deploying account 1000000 tokens", function() {
    return SignalTokenMock.deployed()
      .then(function(instance) {
        return instance.getBalance(balances[0]);
      })
      .then(function(balance) {
        assert.equal(balance.valueOf(), 1000000, "1000000 wasn't the deploying account balance");
      });
  });


  it("should complete a transfer if sender's balance allows", function() {
    var signal_token_mock;

    var account_one = balances[0];
    var account_one_starting_balance;
    var account_one_ending_balance;

    var account_two = balances[1];
    var account_two_starting_balance;
    var account_two_ending_balance;

    var amount = 1000000;

    return SignalTokenMock.deployed()
      .then(function(instance) {
        signal_token_mock = instance;
        return signal_token_mock.getBalance(account_one);
      })
      .then(function(balance) {
        account_one_starting_balance = balance.toNumber();
        return signal_token_mock.getBalance(account_two);
      })
      .then(function(balance) {
        account_two_starting_balance = balance.toNumber();
        return signal_token_mock.transfer(amount, account_two, {from: account_one});
      })
      .then(function() {
        return signal_token_mock.getBalance(account_one);
      })
      .then(function(balance) {
        account_one_ending_balance = balance.toNumber();
        return signal_token_mock.getBalance(account_two);
      })
      .then(function(balance) {
        account_two_ending_balance = balance.toNumber();

        assert.equal(
          account_one_ending_balance,
          account_one_starting_balance - amount,
          "0 wasn't the deploying account final balance"
        );
        assert.equal(
          account_two_ending_balance,
          account_two_starting_balance + amount,
          "1000000 wasn't the destination account final balance"
        );
      });
  });
});
