// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Leverage.sol";

contract LeverageFactory {
    struct Tournament {
        address deployer;
        string name;
        address contractAddress;
    }

    Tournament[] public deployedContracts;
    mapping(address => string) public deployerNames;

    event LeverageDeployed(address indexed contractAddress, address indexed owner, string name);

    function deployLeverage(uint256 entranceFee, uint8 promotionShare, string memory name) external {
        Leverage newContract = new Leverage(entranceFee, promotionShare);
        deployedContracts.push(Tournament(msg.sender, name, address(newContract)));
        deployerNames[msg.sender] = name;
        emit LeverageDeployed(address(newContract), msg.sender, name);
    }

    function getDeployedContracts() external view returns (Tournament[] memory) {
        return deployedContracts;
    }
}