const SimpleStorage = artifacts.require('./SimpleStorage.sol')
const MoviesBlockbusterEvents = artifacts.require('./MoviesBlockbusterEvents.sol')
const EventsBlockbusterEvents = artifacts.require('./EventsBlockbusterEvents.sol')
const OwnedUpgradeabilityProxy = artifacts.require('./OwnedUpgradeabilityProxy.sol')
const SafeMath = artifacts.require('./SafeMath.sol')



module.exports = function (deployer) {
  deployer.deploy(SimpleStorage)
  deployer.deploy(OwnedUpgradeabilityProxy)
  deployer.deploy(SafeMath)
  deployer.link(SafeMath, MoviesBlockbusterEvents)
  deployer.deploy(MoviesBlockbusterEvents)
  deployer.deploy(EventsBlockbusterEvents)
}
