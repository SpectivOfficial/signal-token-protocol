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
    .then(function() {
      app.renderCampaign();
    });
  },

  renderCampaign: function() {
    var signalTokenProtocolInstance;
    var campaignId;
    var advertiser = app.accounts[0];

    app.contracts.SignalTokenProtocol.deployed()
    .then(function(instance) {
      signalTokenProtocolInstance = instance;
      return signalTokenProtocolInstance.numberOfCampaigns.call({ from: advertiser, gas: 100000 });
    })
    .then(function(numberOfCampaigns) {
      campaignId = parseInt(numberOfCampaigns.valueOf()) - 1;
      return signalTokenProtocolInstance.getCampaign(campaignId, { from: advertiser, gas: 100000 });
    })
    .then(function(campaign) {
      $(".instructions1").hide();
      $(".create-campaign").hide();
      $(".advertiser").text(campaign[0]);
      $(".publisher").text(campaign[1]);
      $(".executor").text(campaign[2]);
      $(".amount").text(campaign[3] + " SIG");
      $(".instructions2").show();
      $(".campaign").show();
    });
  }
}

window.addEventListener("load", function() {
  app.init();
});
