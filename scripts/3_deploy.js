// Deploy Leverage contract only

const hre = require("hardhat")

async function main() {
  // Compile the contract
  const leverage = await hre.ethers.getContractFactory("Leverage");

  const entranceFee = ethers.parseEther("1")
  const promotionShare = 3
  const name = "Leverage"
  const [promoter] = await hre.ethers.getSigners()

  // Deploy the contract
  console.log("Deploying LeverageFactory...");
  const myContract = await leverage.deploy(entranceFee, promotionShare, name, promoter, { gasLimit: 12000000} );
  const tx = await myContract.waitForDeployment();
  console.log(`Leverage deployed to: ${await myContract.getAddress()} on ${hre.network.name}\n`);

  // Verify on Etherscan
  const { chainId } = await hre.ethers.provider.getNetwork();

  if (chainId != 31337) {
    // Verify the contract on Etherscan
    console.log(`Verifying contract on ${hre.network.name}...`);

    try {
      await run(`verify:verify`, {
        address: contractAddress,
        constructorArguments: [routerAddress],
      });
      console.log("Contract verified successfully!");
    } catch (error) {
      console.error("Error verifying contract:", error);
    }
  } else {
    console.log(`Skipping verification on localhost`)
  }
  console.log(`\nDeployment Script Complete!`)

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
