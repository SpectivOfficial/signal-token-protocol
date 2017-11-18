var SignalTokenMock = artifacts.require("./SignalTokenMock.sol");
var Spectiv = artifacts.require("./Spectiv.sol");

module.exports = function(deployer) {
  deployer.deploy(SignalTokenMock);
  deployer.deploy(Spectiv);
};
