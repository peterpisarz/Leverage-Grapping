// SPDX-License-Identifier: UNLICENSED
// Constructor args
// 1000000000000000000
// 3
// Leverage

pragma solidity ^0.8.20;

import "./Leverage.sol";

contract LeverageFactory {
    struct Tournaments {
        address deployer;
        uint256 entranceFee;
        uint8 promotionShare;
        string name;
        address contractAddress;
    }

    Tournaments[] public deployedContracts;
    mapping(address => string) public deployerNames;

    event LeverageDeployed(address indexed contractAddress, address indexed owner, string name);

    function deployLeverage(uint256 _entranceFee, uint8 _promotionShare, string memory _name) external {
        require(bytes(deployerNames[msg.sender]).length == 0, "Deployer already has a name assigned");
        Leverage newContract = new Leverage(_entranceFee, _promotionShare, _name, msg.sender);
        deployedContracts.push(Tournaments({
            deployer: msg.sender, 
            entranceFee: _entranceFee,
            promotionShare: _promotionShare,
            name: _name,
            contractAddress: address(newContract)
        }));

        deployerNames[msg.sender] = _name;
        emit LeverageDeployed(address(newContract), msg.sender, _name);
    }

    function getAllDeployedContracts() public view returns (Tournaments[] memory) {
        return deployedContracts;
    }

    function getLeverageContract(uint256 index) public view returns (Tournaments memory) {
        require(index < deployedContracts.length, "Index out of bounds");
        return deployedContracts[index];
    }

    function deployedContractsLength() external view returns (uint256) {
        return deployedContracts.length;
    }
}