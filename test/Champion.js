const { expect } = require("chai");

const fromWei = (num) => ethers.formatUnits(num, 'ether')
const toWei = (num) => ethers.formatUnits(num, 'wei')

describe("Champion", function () {

  // Contracts are deployed using the first signer/account by default

  let champion
  let deployer, tournament, promotion
  const classes = ['light', 'middle', 'heavy']
  const weights = [66, 77, 88]
  const entranceFee = toWei(1)
  console.log(`entranceFee: ${entranceFee}ETH`)
  const promotionShare = 3

  beforeEach(async function () {

    // Get Contract Factories and Signers
    const Champion = await ethers.getContractFactory("Champion");
    const Tournament = await ethers.getContractFactory("Tournament");
    [deployer, promotion, competitor] = await ethers.getSigners();

    //get competitors
    this.competitors = (await ethers.getSigners()).slice(3, 10); // Get an additional 7 signers for competitors

    // Deploy Contracts
    champion = await Champion.deploy(classes, weights);
    tournament = await Tournament.connect(promotion).deploy(champion.target, entranceFee, promotionShare);

    // Register Competitor Zero
    await tournament.connect(competitor).registerCompetitor('Thang', 'Nguyen', 'light', {value: toWei(1)})

  })

  describe("Deployment", function () {

    it("Returns the name and symbol for champions", async function () {
      const nftName = "TournamentChampion"
      const nftSymbol = "CHAMP"
      expect(await champion.name()).to.equal(nftName);
      expect(await champion.symbol()).to.equal(nftSymbol);
    });

    it("Should revert if no Champ is declared", async function () {
      await expect(champion.currentChamp('light')).to.be.revertedWith(
        "NFT not minted for this weight class"
      );
    })

    it("Registers competitors", async function () {
      expect(await tournament.connect(competitor).registerCompetitor('Thang', 'Nguyen', 'light', {value: toWei(1)})).to.emit(tournament, "CompetitorRegistered")
        .withArgs(competitor.address, 66)

      const bracket = await tournament.bracket(0)
      console.log(bracket)
      const competitorZero = await tournament.competitors(0)
      console.log(competitorZero)
    })

    it("Creates a full bracket", async function () {

      for (let i = 0; i < this.competitors.length; i++) {
        await tournament.connect(this.competitors[i]).registerCompetitor(`Competitor${i}`, 'LastName', 'light', {value: toWei(1)})
      }

      expect(await tournament.getBracketLength()).to.equal(8)

    })

    it("Mints a Champion when there is none", async function () {

      const classHash = ethers.solidityPackedKeccak256(['string'], ['light'])

      // Assign tournament address
      await champion.setTournamentContract(tournament.target)

      // Call Mint function
      await tournament.connect(promotion).awardChampionNFT('light', competitor.address)

      expect(await champion.ownerOf(classHash)).to.equal(competitor.address)

      expect(await champion.balanceOf(competitor.address)).to.equal(1)
    })

    it("Creates matches from the bracket", async function () {
      for (let i = 0; i < this.competitors.length; i++) {
        await tournament.connect(this.competitors[i]).registerCompetitor(`Competitor${i}`, 'LastName', 'light', {value: toWei(1)})
      }

      // Create Matches
      for (let i=0; i < this.competitors.length; i+=2) {
        await tournament.connect(promotion).createMatch(i, i+1, 'light', false)
      }

      for (let i=0; i < (this.competitors.length/2); i++){
        let match = await tournament.matches(i)
        console.log(`Match ${i}: `, match);
        
      }

    })
  });
});
