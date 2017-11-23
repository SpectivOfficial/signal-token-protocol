const Advertiser = artifacts.require("./Advertiser.sol");
const Campaign = artifacts.require("./Campaign.sol");
const SignalTokenProtocol = artifacts.require("./SignalTokenProtocol.sol");
const TokenStub = artifacts.require("./TokenStub.sol");

module.exports = function(deployer) {
  deployer.deploy(Advertiser);
  deployer.deploy(Campaign);
  deployer.deploy(SignalTokenProtocol);
  deployer.deploy(TokenStub);
};
