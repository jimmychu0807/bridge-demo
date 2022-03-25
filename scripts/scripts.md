## Sample script for interaction

```javascript
const { ether, network, getNamedAccounts, deployments } = hre
const { tokenOwner, alith, baltathar } = await getNamedAccounts()

const tokenOwner_defi1 = await ethers.getContract('Defi1Deployment', tokenOwner)

await tokenOwner_defi1.transfer(baltathar, 100000)

const baltathar_defi1 = await ethers.getContract('Defi1Deployment', baltathar)
const baltathar_defi2 = await ethers.getContract('Defi2Deployment', baltathar)

(await baltathar_defi1.balanceOf(baltathar)).toString()
(await baltathar_defi2.balanceOf(baltathar)).toString()

await baltathar_defi1.exchange(baltathar_defi2.address, 100000)

(await baltathar_defi1.balanceOf(baltathar)).toString()
(await baltathar_defi2.balanceOf(baltathar)).toString()
```
