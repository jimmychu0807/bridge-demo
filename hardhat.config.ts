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
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local']
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      tags: ['local', 'test']
    },
    rinkeby: {
      url: process.env.ALCHEMY_RINKEBY_URL,
      live: true,
      saveDeployments: true,
      tags: ['staging']
    },
  },
  namedAccounts: {
    deployer: 0
  }
}