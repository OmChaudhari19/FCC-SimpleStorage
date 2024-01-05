const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
describe("FundMe", function () {
  let fundMe;
  let mockV3Aggregator;
  let deployer;

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]);
    fundMe = await deployments.get("FundMe");
    mockV3Aggregator = await deployments.get("MockV3Aggregator");
  });

  describe("constructor", function () {
    it("sets the aggregator addresses correctly", async () => {
      const response = await fundMe.getPriceFeed();
      console.log(response);
      assert.equal(response, mockV3Aggregator.address);
    });
  });

//   describe("fund", () => {
//     it("Fails if not enough fund's", async () => {
//       await expect
//         .equal(fundMe.fund())
//         .to.be.revertedWith("Not Enough for Transaction!!");
//     });
//   });
});
