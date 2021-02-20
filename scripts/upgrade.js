// scripts/prepare_upgrade.js
async function main() {
    const proxyAddress = '0xFF60fd044dDed0E40B813DC7CE11Bed2CCEa501F';
   
    const BoxV2 = await ethers.getContractFactory("Box");
    console.log("Preparing to upgrade...");
    const boxV2Address = await upgrades.prepareUpgrade(proxyAddress, BoxV2);
    console.log("BoxV2 at:", boxV2Address);
  }
   
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });