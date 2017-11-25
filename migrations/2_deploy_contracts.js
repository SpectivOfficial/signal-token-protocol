const SignalTokenProtocol = artifacts.require("./SignalTokenProtocol.sol");
const TokenStub = artifacts.require("./TokenStub.sol");

module.exports = function(deployer) {
  deployer.deploy(SignalTokenProtocol);
  deployer.deploy(TokenStub);
};
