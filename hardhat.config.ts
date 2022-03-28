import 'dotenv/config'
import { task } from "hardhat/config"
import "hardhat-deploy"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"

task("accounts", "Prints the list of accounts", async(taskArgs, hre) => {
  const accts = await hre.ethers.getSigners();

  for (const acct of accts) {
    console.log(acct.address)
  }
})

export default {
  solidity: "0.8.12",
  settings: {
    evmVersion: "london"
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      live: false,
      saveDeployments: false,
      tags: ['local', 'test']
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      live: false,
      saveDeployments: false,
      tags: ['local']
    },
    rinkeby: {
      url: process.env.RINKEBY_ENDPOINT,
      accounts: process.env.PRIVATE_KEYS?.split(','),
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
    alttest: {
      url: process.env.ALTTEST_ENDPOINT,
      accounts: process.env.PRIVATE_KEYS?.split(','),
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
    bsctestnet: {
      url: process.env.BSCTESTNET_ENDPOINT,
      accounts: process.env.PRIVATE_KEYS?.split(','),
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      // dev alith account
      rinkeby: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
      alttest: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
      bsctestnet: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
    },
    tokenOwner: 1,
    alice:      2,
    bob:        3,
    charlie:    4,
  }
}
