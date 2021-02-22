// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Box = await ethers.getContractFactory("Box");
    const box = await Box.deploy();
    //const box = await upgrades.deployProxy(Box, [42], { initializer: 'store' });
    await box.deployed();
  
    console.log("Box address:", box.address);
  
    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(token);
  }
  
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  