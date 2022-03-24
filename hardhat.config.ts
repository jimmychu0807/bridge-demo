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
      saveDeployments: true,
      tags: ['local', 'test']
    },
    localhost: {
      url: 'http://127.0.0.1:8545/',
      live: false,
      saveDeployments: true,
      tags: ['local']
    },
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
    alith: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
    baltathar: '0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0',
  }
}
