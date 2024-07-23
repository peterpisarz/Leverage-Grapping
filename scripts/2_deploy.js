const hre = require('hardhat');
const ethers = hre.ethers;

async function main() {
  // Load environment variables
  const FACTORY_CONTRACT_ADDRESS = "0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f";

  // Initialize the factory contract
  const factoryContract = await ethers.getContractAt('LeverageFactory', FACTORY_CONTRACT_ADDRESS);

  // Define deployment parameters
  const entranceFee = ethers.parseEther("1.0"); // 1 ETH entrance fee
  const promotionShare = 3; // 3% promotion share
  const tournamentName = "Leverage Invitational"; // Tournament name

  // Deploy the new tournament
  try {
    console.log("Deploying Leverage tournament...");
    const tx = await factoryContract.deployLeverage(entranceFee, promotionShare, tournamentName);
    console.log('Transaction sent, waiting for confirmation...');
    const receipt = await tx.wait();

    // Log the entire receipt for debugging
    console.log('Transaction receipt:', JSON.stringify(receipt, null, 2));

    // Parse logs to find the LeverageDeployed event
    const leverageDeployedEvent = receipt.logs.find(log => {
      const parsedLog = factoryContract.interface.parseLog(log);
      return parsedLog.name === 'LeverageDeployed';
    });

    if (leverageDeployedEvent) {
      const { contractAddress, owner, name } = factoryContract.interface.parseLog(leverageDeployedEvent).args;
      console.log(`New Leverage tournament deployed to ${contractAddress} by ${name} from ${owner} on ${hre.network.name}\n`);
    } else {
      console.error('LeverageDeployed event not found in receipt.');
    }
  } catch (error) {
    console.error('Error creating tournament:', error);
  }

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
