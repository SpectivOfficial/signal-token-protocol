const SignalTokenProtocol = artifacts.require("./SignalTokenProtocol.sol");

module.exports = function(deployer) {
  deployer.deploy(SignalTokenProtocol);
};
