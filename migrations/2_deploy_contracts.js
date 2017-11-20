var SignalTokenMock = artifacts.require("./SignalTokenMock.sol");
var Spectiv = artifacts.require("./Spectiv.sol");
var Advertiser = artifacts.require("./Advertiser.sol");

module.exports = function(deployer) {
  deployer.deploy(SignalTokenMock);
  deployer.deploy(Spectiv);
  deployer.deploy(Advertiser);
};
