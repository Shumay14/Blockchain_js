var Faucet = artifacts.require("./Faucet.sol");
var createDID = artifact.require("./registryDID.sol");

module.exports = function(deployer) {
  deployer.deploy(Faucet);
  deployer.deploy(registryDID);
};
