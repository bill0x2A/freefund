require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

const INFURA_PROJECT_ID = "5eea033505074478a21fa33c750edf0f";

// FreeFund platform owner!
// 0x3840Dd66AE0B4A3e46Cb037321a1a1fc64Fed189
const PRIVATE_KEY = "1c5667bf63ef20943b14f1f64945f5a53c7f723728b1728b797ea992a4272fb7"

module.exports = {
  
  solidity: "0.7.6",
  
  networks: {
    // Ropsten PoW testnet
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    // Rinkeby PoA testnet
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    // Ethereum Mainnet
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    // matic testnet
    mumbai: {
      url: `https://rpc-mumbai.matic.today`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    // matic mainnet
    matic: {
      url: `https://rpc-mainnet.maticvigil.com`,
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },

  paths : {
    artifacts : "./frontend/src/artifacts",
  }

};
