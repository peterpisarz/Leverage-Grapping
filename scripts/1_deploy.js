const hre = require("hardhat")

async function main() {
  // Compile the contract
  const leverageFactory = await hre.ethers.getContractFactory("LeverageFactory");

  // Deploy the contract
  console.log("Deploying LeverageFactory...");
  const myContract = await leverageFactory.deploy( { gasLimit: 12000000} );
  const tx = await myContract.waitForDeployment();
  console.log(`LeverageFactory deployed to: ${await myContract.getAddress()} on ${hre.network.name}\n`);

  // // Verify on Etherscan
  // const WAIT_BLOCK_CONFIRMATIONS = 6;
  // await myContract.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

  // console.log(`Verifying contract on Etherscan...`);

  // await run(`verify:verify`, {
  //   address: myContract.address,
  //   constructorArguments: [routerAddress],
  // });

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
