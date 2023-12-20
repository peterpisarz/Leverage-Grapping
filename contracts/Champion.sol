pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Champion is ERC721, Ownable {

    struct WeightClass {
        string className;
        uint256 weightLimit;
    }

    mapping(bytes32 => WeightClass) public weightClasses;
    mapping(uint256 => bytes32) public tokenIdToWeightClass;
    address public tournamentContract;

    constructor(string[] memory classNames, uint256[] memory weightLimits) 
        ERC721("TournamentChampion", "CHAMP")
        Ownable(msg.sender)
    {
        require(classNames.length == weightLimits.length, "Class names and weight limits length mismatch");

        for (uint i = 0; i < classNames.length; i++) {
            bytes32 classHash = keccak256(abi.encodePacked(classNames[i]));
            weightClasses[classHash] = WeightClass(classNames[i], weightLimits[i]);
        }
    }

    function currentChamp(string memory className) public view returns (address) {
        bytes32 classHash = keccak256(abi.encodePacked(className));
        uint256 tokenId = uint256(classHash);

        // Ensure that the NFT for this class has been minted
        require(tokenIdToWeightClass[tokenId] != 0, "NFT not minted for this weight class");

        return ownerOf(tokenId); // 'ownerOf' is a method from ERC721
    }

    function setTournamentContract(address _tournamentContract) external onlyOwner {
        tournamentContract = _tournamentContract;
    }

    function mintChampionNFT(string memory className, address champion) public {
        require(msg.sender == tournamentContract, "Caller is not the tournament contract");
        bytes32 classHash = keccak256(abi.encodePacked(className));
        require(weightClasses[classHash].weightLimit != 0, "Invalid weight class");
        require(tokenIdToWeightClass[uint256(classHash)] == 0, "NFT already minted for this weight class");

        _mint(champion, uint256(classHash));
        tokenIdToWeightClass[uint256(classHash)] = classHash;
    }
}
 