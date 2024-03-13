pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Champion is ERC721, Ownable {
    address public tournamentContract;

    constructor() 
        ERC721("TournamentChampion", "CHAMP")
        Ownable(msg.sender) {}

    function setTournamentContract(address _tournamentContract) external onlyOwner {
        tournamentContract = _tournamentContract;
    }

    function mintChampionNFT(address _champion, uint16 _weightClass) public {
        require(msg.sender == tournamentContract, "Caller is not the tournament contract");
        _safeMint(_champion, _weightClass);
        tokenIdToWeightClass[uint256(classHash)] = classHash;
    }

    function currentChamp(uint16 _weightClass) public view returns (address) {
        // Ensure that the NFT for this class has been minted
        require(ownerOf(_weightClass) != 0, "NFT not minted for this weight class");

        return ownerOf(_weightClass); // 'ownerOf' is a method from ERC721
    }

}
 