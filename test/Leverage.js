const { expect } = require("chai");

const fromWei = (num) => ethers.formatUnits(num, 'ether')
const toWei = (num) => ethers.parseUnits(num.toString(), 'ether')

console.log("\n*** Welcome to Leverage Tournaments ***\n")

describe("Leverage", function () {

  const entranceFee = toWei(1)
  console.log(entranceFee)
  const promotionShare = 3
  let leverage, promotion, champAddress

  // Contracts are deployed using the first signer/account by default
  beforeEach(async function () {

    // Get Contract Factories and Signers
    const Leverage = await ethers.getContractFactory("Leverage");
    [promotion] = await ethers.getSigners();

    // Get an additional 7 signers for competitors
    this.competitors = (await ethers.getSigners()).slice(1, 9);

    let comp7 = await ethers.provider.getBalance(this.competitors[7])
    // console.log("Competitor7 Balance Before: ", fromWei(comp7))

    let initialPromotion = await ethers.provider.getBalance(promotion)
    // console.log(`Initial Promotion Balance: ${fromWei(initialPromotion)}`)

    // Deploy contract
    leverage = await Leverage.connect(promotion).deploy(entranceFee, promotionShare);

    // Get starting contract balance
    let balanceBefore = await ethers.provider.getBalance(leverage.target);
    // console.log(`Contract Balance Before: ${balanceBefore}`)

    let promotionBalance = await ethers.provider.getBalance(promotion)
    // console.log(`Promotion Balance Before: ${promotionBalance}`)

    // Register competitors
    for (let i = 0; i < this.competitors.length; i++) {
      await leverage.connect(this.competitors[i]).register(`Competitor${i+1}`, `LastName${i+1}`, {value: entranceFee})
    }


    comp7 = await ethers.provider.getBalance(this.competitors[7])
    // console.log("Competitor7 Balance After: ", fromWei(comp7))

    // Get contract balance after 8 competitors register
    let balanceAfter = await ethers.provider.getBalance(leverage.target);
    // console.log(`Contract Balance After: ${balanceAfter}`)

    promotionBalance = await ethers.provider.getBalance(promotion)
    // console.log(`Promotion Balance After: ${promotionBalance}`)

    // Create matches
    await leverage.connect(promotion).createMatches(1)

    // Declare winners in quarter finals
    for (let i=1, j=1; i < 5; i++, j+=2) {
      // console.log(`Match: ${i}`)
      // console.log(`Winner: ${j}`)
      await leverage.connect(promotion).winner(i, j, 1)
    }
  })

  describe("Deployment", function () {
    it("Sets the entrance fee and promotion share", async function () {
      expect(await leverage.entranceFee()).to.equal(entranceFee);
      expect(await leverage.promotionShare()).to.equal(promotionShare);
    });
    it("Registers competitors", async function () {
      expect(await leverage.competitorId()).to.equal(8);
      // Register competitors
      for (let i = 0; i < this.competitors.length; i++) {
        let competitor = await leverage.getCompetitor(i+1)
        // console.log("Competitor: ", i, competitor)
      }
    });
    it("Gets competitors info", async function () {
      const details = await leverage.getCompetitor(2)
      const last = details.lastName
      expect(last).to.equal("LastName2");
    });
    it("Registers 8 competitors", async function () {
      expect(await leverage.competitorId()).to.equal(8);
    });
  })

  describe("Creating matches", function () {
    it("Creates matches from the competitors", async function () {
      const result = await leverage.getMatches()
      expect(result).to.equal(4)
      for (let i=1; i<=result; i++) {      
        console.log(await leverage.getMatch(i))
      }
    })
  })

  describe("Running the Tournament", function () {
    it("Records the Winners", async function () {
      for (let i=1, j=1; i<=4; i++, j+=2) {
        const result = await leverage.getMatch(i)
        // console.log(`The winner of Match ${i} is ${result.winner.toString()}`)
        expect(result.winner.toString()).to.equal(j.toString())
      }
    })
  })

  describe("Creating the Semi Finals", function () {
    
    beforeEach(async function () {
      await leverage.connect(promotion).createMatches(2)
      // Declare winners in the semi finals
      // console.log("winnerSemi\n")
      await leverage.connect(promotion).winner(5, 3, 2)

      await leverage.connect(promotion).winner(6, 7, 2)
    })

    describe("Running the Semi Finals", function () {
      it("Creates the Semi Finals bracket", async function () {
        
        expect(await leverage.getMatches()).to.equal(6)
        // console.log(await leverage.getMatch(5))
        // console.log(await leverage.getMatch(6))
      })

      it("Declares the Semi Finals winners", async function () {
        for (let i=5, j=3; i<=6; i++, j+=4) {
          const result = await leverage.getMatch(i)
          // console.log(`The winner of Match ${i} is ${result.winner.toString()}`)
          expect(result.winner.toString()).to.equal(j.toString())
        }
      })
    })

    describe("Running the Finals", function () {
      beforeEach(async function () {
        await leverage.connect(promotion).createMatches(3)
        // console.log("Matches ", await leverage.getMatches())
        // console.log(await leverage.getMatch(7))

        const contractBalance = await ethers.provider.getBalance(leverage.target);
        // console.log(`Contract Before: ${contractBalance}`)
        await leverage.connect(promotion).winner(7, 7, 3)
      })
      
      it("Creates the Finals bracket", async function () {
        expect(await leverage.getMatches()).to.equal(7)
      })

      it("Declares the champion", async function () {
        let champ = await leverage.getCompetitor(7)
        // console.log(champ)
        champAddress = champ.addr
        // console.log("Champ Address", champAddress)
        expect(await leverage.champion()).to.equal(champ.id)
      })
      it("Pays the champion", async function () {

        const balance = await ethers.provider.getBalance(champAddress)
        // console.log(`Champ balance: ${fromWei(balance)}`)
        // expect(champAddress.balance).to.equal(8)
      })
      it("Keeps fighters records", async function () {
        let wins, losses
        const id = await leverage.competitorId()
        for ( let i = 1; i < id; i++ ) {
          wins = await leverage.getCompetitor(i).wins
          losses = await leverage.getCompetitor(i).losses
          competitor = await leverage.getCompetitor(i)
          // console.log("Competitor ", i, " ", wins.toString())
          console.log(competitor)
        }
      })
    })
  })
})
