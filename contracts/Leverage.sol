// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Leverage is Ownable{
	struct Competitor {
		uint32 id;
        address addr;
        string name;
        string lastName;
        uint wins;
        uint losses;
    }

    struct Match {
    	uint256 id;
        uint32 competitor1;
        uint32 competitor2;
        uint256 winner; // using 0 for placeholder, competitor id after match is decided
    }

    uint256 public entranceFee;
    uint8 public promotionShare;
    uint32 public competitorId;
    uint32 public matchId;
    uint32 public champion;
    Match[] public matches;
    mapping(uint32 => uint32[]) public bracket;
    mapping(uint32 => Competitor) public competitors;

    constructor(uint256 _entranceFee, uint8 _promotionShare) 
        Ownable(msg.sender) {
        entranceFee = _entranceFee;
        promotionShare = _promotionShare;
    }

    function register(string memory first, string memory last) public payable {
    	require(msg.value == entranceFee, "Incorrect entrance fee");
        require(competitorId < 8, "Quarter Finals is full");

        competitorId++;
        bracket[1].push(competitorId); // An array of competitor Ids

        competitors[competitorId] = Competitor(competitorId, msg.sender, first, last, 0, 0);

        // Transfer promotion share
        uint256 promotionAmount = (entranceFee * promotionShare) / 100;
        payable(owner()).transfer(promotionAmount);
    }

    function getCompetitor(uint32 _competitorId) public view returns (Competitor memory) {
        require(_competitorId > 0 && _competitorId <= competitorId, "Competitor not registered.");
        return competitors[_competitorId];
    }

    // accept uint8 _round arg for create match 
    function createMatches(uint8 _round) public onlyOwner {
        require(bracket[_round].length % 2 == 0, "There must be an even number of competitors in the round.");
        require(bracket[_round].length > 0, "There are no competitors in the bracket");
        
        for (uint i = 0; i < bracket[_round].length; i += 2) {
            matchId++;
            matches.push(Match(matchId, bracket[_round][i], bracket[_round][i+1], 0));
        }
    }

    function getBracket(uint8 _round) public view returns (uint32[] memory){
        return bracket[_round];
    }

    function getMatches() public view returns (uint){
        return matches.length;
    }

    function getMatch(uint32 _matchId) public view returns (Match memory) {
        require(_matchId > 0 && _matchId <= matchId, "Match does not exist");
        return matches[_matchId - 1];
    }

    function winner(uint32 _matchId, uint32 _competitorId, uint8 _round) public onlyOwner {
        require(_matchId > 0 && _matchId <= matches.length, "Match does not exist");
        require(matches[_matchId - 1].competitor1 == _competitorId || 
                matches[_matchId - 1].competitor2 == _competitorId, 
                "Competitor is not in this match");

        // Update the winner for the match
        matches[_matchId - 1].winner = _competitorId;

        // Record wins and losses
        if (matches[_matchId - 1].competitor1 == _competitorId) {
            competitors[_competitorId].wins++;
            uint32 loser = matches[_matchId - 1].competitor2;
            competitors[loser].losses++;
        } else {
            competitors[_competitorId].losses++;
            // uint32 winner = ;
            competitors[matches[_matchId - 1].competitor2].wins++;
        }

        if (bracket[_round].length == 2) {
            // Finals match
            champion = _competitorId;
            payChampion(champion);
        } else {
            bracket[_round + 1].push(_competitorId);
        }
    }

    function payChampion(uint32 _competitorId) private {
        address payable recipient = payable(competitors[_competitorId].addr);
        require(recipient != address(0), "Competitor address not found");
        uint256 prizeAmount = address(this).balance;
        require(address(this).balance >= prizeAmount, "Insufficient balance to pay champion");

        // Transfer prize amount to the champion's address
        (bool sent, ) = recipient.call{value: prizeAmount}("");
        require(sent, "Failed to send prize");
    }
}
