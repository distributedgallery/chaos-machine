const Chaos = artifacts.require('./Chaos.sol')

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Chaos)
}
