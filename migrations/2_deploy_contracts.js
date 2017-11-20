const Advertiser = artifacts.require("./Advertiser.sol");
const Campaign = artifacts.require("./Campaign.sol");
const SignalTokenMock = artifacts.require("./SignalTokenMock.sol");
const Spectiv = artifacts.require("./Spectiv.sol");

module.exports = function(deployer) {
  deployer.deploy(Advertiser);
  deployer.deploy(Campaign);
  deployer.deploy(SignalTokenMock);
  deployer.deploy(Spectiv);
};
