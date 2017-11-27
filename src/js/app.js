app = {
  web3Provider: null,
  contracts: {},
  accounts: [],

  init: function() {
    return app.initWeb3();
  },

  initWeb3: function() {
    app.web3Provider = new Web3.providers.HttpProvider("http://localhost:9545");
    web3 = new Web3(app.web3Provider);

    return app.initAccounts();
  },

  initAccounts: function() {
    web3.eth.getAccounts(function(error, response) {
      app.accounts = response;
    });

    return app.initSignalTokenProtocol();
  },

  initSignalTokenProtocol: function() {
    $.getJSON("SignalTokenProtocol.json", function(data) {
      var SignalTokenProtocolArtifact = data;
      app.contracts.SignalTokenProtocol = TruffleContract(SignalTokenProtocolArtifact);
      app.contracts.SignalTokenProtocol.setProvider(app.web3Provider);
    })
    .then(function() {
      app.initBalances();
    });
  },

  initBalances: function() {
    var signalTokenProtocolInstance;
    var advertiser = app.accounts[0];
    var amount = 500000;

    app.contracts.SignalTokenProtocol.deployed()
    .then(function(instance) {
      signalTokenProtocolInstance = instance;
      return signalTokenProtocolInstance.getBalance(advertiser, { from: advertiser, gas: 1000000 })
    })
    .then(function(advertiserBalance) {
      if (advertiserBalance == 0) {
        return signalTokenProtocolInstance.executeTransfer(
          signalTokenProtocolInstance.address,
          advertiser,
          amount,
          { from: advertiser, gas: 1000000 }
        );
      }
    })
    .then(function() {
      app.initTemplate();
    });
  },

  initTemplate: function() {
    $("#createCampaign").unbind().click(app.createCampaign);
    $(window).keydown(function(event) {
      if (event.keyCode == 13 && $("#campaignAmount").is(":focus")) {
          event.preventDefault();
          app.createCampaign();
          return false;
      }
    });
  },

  createCampaign: function() {
    var signalTokenProtocolInstance;
    var advertiser = app.accounts[0];
    var publisher = app.accounts[1];
    var executor = app.accounts[2];
    var amount = parseInt($("#campaignAmount").val());

    if (amount > 500000) {
      alert("Campaign amount cannot exceed more than 500000 SIG.");
    } else {
      app.contracts.SignalTokenProtocol.deployed()
      .then(function(instance) {
        signalTokenProtocolInstance = instance;
        return signalTokenProtocolInstance.createCampaign(
          advertiser,
          publisher,
          executor,
          amount,
          { from: advertiser, gas: 1000000 }
        );
      })
      .then(function(foo) {
        app.renderCampaign();
      });
    }
  },

  renderCampaign: function() {
    var signalTokenProtocolInstance;
    var campaignId;
    var campaign;
    var advertiserBalance;
    var publisherBalance;
    var advertiser = app.accounts[0];
    var publisher = app.accounts[1];

    app.contracts.SignalTokenProtocol.deployed()
    .then(function(instance) {
      signalTokenProtocolInstance = instance;
      return signalTokenProtocolInstance.numberOfCampaigns.call({ from: advertiser, gas: 100000 });
    })
    .then(function(numberOfCampaigns) {
      campaignId = parseInt(numberOfCampaigns.valueOf()) - 1;
      return signalTokenProtocolInstance.getCampaign(campaignId, { from: advertiser, gas: 100000 });
    })
    .then(function(campaignData) {
      campaign = campaignData;
      return signalTokenProtocolInstance.getBalance(advertiser, { from: advertiser, gas: 100000 });
    })
    .then(function(balance) {
      advertiserBalance = parseInt(balance.valueOf());
      return signalTokenProtocolInstance.getBalance(publisher, { from: advertiser, gas: 100000 });
    })
    .then(function(balance) {
      publisherBalance = parseInt(balance.valueOf());
      $(".instructions1").hide();
      $(".create-campaign").hide();
      $(".advertiser").text(campaign[0]);
      $(".publisher").text(campaign[1]);
      $(".executor").text(campaign[2]);
      $(".amount").text(campaign[3] + " SIG");
      $(".advertiser-balance").text(advertiserBalance + " SIG");
      $(".publisher-balance").text(publisherBalance + " SIG");
      $(".instructions2").show();
      $(".campaign").show();
      $(".advertisement").unbind().click(app.executeCampaign);
    });
  },

  executeCampaign: function() {
    var signalTokenProtocolInstance;
    var campaignId;
    var advertiserBalance;
    var publisherBalance;
    var advertiser = app.accounts[0];
    var publisher = app.accounts[1];
    var executor = app.accounts[2];

    app.contracts.SignalTokenProtocol.deployed()
    .then(function(instance) {
      signalTokenProtocolInstance = instance;
      return signalTokenProtocolInstance.numberOfCampaigns.call({ from: advertiser, gas: 100000 });
    })
    .then(function(numberOfCampaigns) {
      campaignId = parseInt(numberOfCampaigns.valueOf()) - 1;
      return signalTokenProtocolInstance.executeCampaign(campaignId, { from: executor, gas: 100000 });
    })
    .then(function() {
      return signalTokenProtocolInstance.getBalance(advertiser, { from: advertiser, gas: 100000 });
    })
    .then(function(balance) {
      advertiserBalance = parseInt(balance.valueOf());
      return signalTokenProtocolInstance.getBalance(publisher, { from: advertiser, gas: 100000 });
    })
    .then(function(balance) {
      publisherBalance = parseInt(balance.valueOf());
      $(".advertiser-balance").text(advertiserBalance + " SIG");
      $(".publisher-balance").text(publisherBalance + " SIG");
    });
  }
}

window.addEventListener("load", function() {
  app.init();
});
