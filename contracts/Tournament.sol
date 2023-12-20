// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Champion.sol"; // Import the Champion contract

contract Tournament is Ownable {
    Champion public championContract;

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
        uint256 winner; // 0 if not yet decided
        bool complete;
        bool finals;
    }

    uint256[] public bracket;
    uint256[] public round2;
    uint256[] public semiFinals;
    uint256 public entranceFee;
    uint256 public promotionShare;
    uint256 public matchCount; // Counter for the number of matches
    uint256 public competitorCount; // Counter for the number of competitors
    mapping(uint256 => Competitor) public competitors;
    mapping(uint256 => Match) public matches;
    mapping(address => bool) public isRegistered;

    event CompetitorRegistered(address competitor, string weightClass);
    event MatchCreated(uint256 weightClass, uint256 matchIndex);
    event MatchResult(uint256 competitor1, uint256 competitor2, uint256 matchIndex, address winner);

    constructor(address _championContract, uint256 _entranceFee, uint256 _promotionShare) 
        Ownable(msg.sender) {
        championContract = Champion(_championContract);
        entranceFee = _entranceFee;
        promotionShare = _promotionShare;
        competitorCount = 0; // Initialize competitor count
    }

    function registerCompetitor(string memory _first, string memory _last, string memory weightClass) external payable {
        require(msg.value == entranceFee, "Incorrect entrance fee");
        require(bracket.length < 8, "Bracket is already full");

        competitorCount++;

        isRegistered[msg.sender] = true;

        competitors[competitorCount] = Competitor(msg.sender, _first, _last, weightClass, 0, 0);
        bracket.push(bracket.length);

        emit CompetitorRegistered(msg.sender, weightClass);

        // Transfer promotion share
        uint256 promotionAmount = (entranceFee * promotionShare) / 100;
        payable(owner()).transfer(promotionAmount);
    }

    function createMatch(uint256 competitor1Index, uint256 competitor2Index, string memory _weightClass, bool _isFinals) external onlyOwner {
        matchCount++;
        matches[matchCount] = Match({
            competitor1: competitor1Index,
            competitor2: competitor2Index,
            weightClass: _weightClass,
            winner: 0,
            complete: false,
            finals: _isFinals
        });
    }

    function declareWinner(uint256 matchIndex, uint256 winnerIndex, bool isFinals) external onlyOwner {
        Match storage matchItem = matches[matchIndex];
        require(matchItem.complete == true, "Winner already declared");
        require(winnerIndex == matchItem.competitor1 || winnerIndex == matchItem.competitor2, "Invalid winner index"); //The winner must be someone from the match

        matchItem.winner = winnerIndex;
        matchItem.complete = true;
        Competitor storage winner = competitors[winnerIndex];
        winner.wins++;

        if (isFinals) {
            awardChampionNFT(competitors[winnerIndex].weightClass, competitors[winnerIndex].addr);
        }

        // Emit an event for the declared winner
        emit MatchResult(matchItem.competitor1, matchItem.competitor2, matchIndex, winner.addr);
    }

    function awardChampionNFT(string memory _weightClass, address _champion) public onlyOwner {
        require(isRegistered[_champion], "The competitor is not registered to the tournament");

        bytes32 classHash = keccak256(abi.encodePacked(_weightClass));
        uint256 tokenId = uint256(classHash);
        address currentOwner = championContract.ownerOf(tokenId);

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
