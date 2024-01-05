const { getNamedAccounts, network, ethers } = require("hardhat");
const {
  devlopmentChains,
  DeploymentChains,
} = require("../../helper-hardhat-config");
const { assert } = require("ethers");

DeploymentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe;
      let deployer;
      const sendValue = "1000000000000000000"
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        const fundTxResponse = await fundMe.fund({ value: sendValue });
        await fundTxResponse.wait(1);
        const withdrawTxResponse = await fundMe.withdraw();
        await withdrawTxResponse.wait(1);

        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        );
        console.log(
          endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        );
        assert.equal(endingFundMeBalance.toString(), "0");
      });
    });
