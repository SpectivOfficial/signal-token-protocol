var SignalTokenMock = artifacts.require("./SignalTokenMock.sol");

module.exports = function(deployer) {
  deployer.deploy(SignalTokenMock);
};
