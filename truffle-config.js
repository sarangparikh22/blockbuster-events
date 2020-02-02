const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "myth like bonus scare over problem client lizard pioneer submit female collect";


require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity\/test\/helpers)/
})
require('babel-polyfill')

// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!
module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    rinkeby:{
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/3e6ec13d2097464c85eec6b7e437f978")
      },
      network_id: 4
    }
  },
  solc: {
    // Turns on the Solidity optimizer. For development the optimizer's
    // quite helpful, just remember to be careful, and potentially turn it
    // off, for live deployment and/or audit time. For more information,
    // see the Truffle 4.0.0 release notes.
    //
    // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}