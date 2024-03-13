// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Champion.sol"; // Import the Champion contract

contract Tournament is Ownable {

    struct Competitor {
        address addr;
        string name;
        string lastName;
        string weightClass;
        uint wins;
        uint losses;
    }

    struct Match {
        uint256 competitor1;
        uint256 competitor2;
        string weightClass;
        uint256 winner; // 2 by default, 0 for comp1, 1 for comp2
    }

    Champion public championContract;
    uint256[] public bracket;
    uint256 public entranceFee;
    uint256 public promotionShare;
    uint256 public matchCount; // Counter for the number of matches
    uint256 public competitorCount; // Counter for the number of competitors
    mapping(uint256 => Competitor) public competitors;
    mapping(uint256 => Match) public matches;
    mapping(address => bool) public isRegistered;

    constructor(address _championContract, uint256 _entranceFee, uint256 _promotionShare) 
        Ownable(msg.sender) {
        championContract = Champion(_championContract);
        entranceFee = _entranceFee;
        promotionShare = _promotionShare;
    }

    function registerCompetitor(string memory _first, string memory _last, uint16 weightClass) external payable {
        require(msg.value == entranceFee, "Incorrect entrance fee");
        require(bracket.length < 8, "Bracket is full");

        competitorCount++;

        competitors[competitorCount] = Competitor(msg.sender, _first, _last, weightClass, 0, 0);

        emit CompetitorRegistered(msg.sender, weightClass);

        // Transfer promotion share
        uint256 promotionAmount = (entranceFee * promotionShare) / 100;
        payable(owner()).transfer(promotionAmount);
    }

    function createMatch(uint16 competitor1Id, uint16 competitor2Id, uint16 _weightClass) external onlyOwner {
        matchCount++;
        matches[matchCount] = Match({
            competitor1: competitor1Id,
            competitor2: competitor2Id,
            weightClass: _weightClass,
            winner: 2
        });
    }

    function declareWinner(uint256 matchIndex, uint16 winnerIndex, uint16 loserIndex, bool isFinals) external onlyOwner {
        Match storage matchItem = matches[matchIndex];
        require(winnerIndex == matchItem.competitor1 || winnerIndex == matchItem.competitor2, "Invalid winner index"); //The winner must be someone from the match

        matchItem.winner = winnerIndex;
        Competitor storage winner = competitors[winnerIndex];
        winner.wins++;
        Competitor storage loser = competitors[loserIndex];
        loser.lossess++;

        if (isFinals) {
            awardChampionNFT(competitors[winnerIndex].weightClass, competitors[winnerIndex].addr);
        }

        // Emit an event for the declared winner
        emit MatchResult(matchItem.competitor1, matchItem.competitor2, matchIndex, winner.addr);
    }

    function awardChampionNFT(uint16 _weightClass, address _champion) public onlyOwner {
        address currentOwner = championContract.ownerOf(_weightClass);

        if (currentOwner != address(0)) {
            championContract.transferFrom(currentOwner, _champion, tokenId);
        } else {
            championContract.mintChampionNFT(_weightClass, _champion);
        }
    }

    function getBracketLength() public view returns (uint256) {
        return bracket.length;
    }
}
