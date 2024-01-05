const { network } = require("hardhat");
const { networkConfig, DeploymentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const ChainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  if (ChainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[ChainId].ethUsdPriceFeed;
  }
  log("Deploying the contract FundeMe.....");
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    // waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`FundMe Contract Address: ${fundMe.address}`);
  log("--------------------------------------------------");
  if (ChainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    log("Verifying.......")
    await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    log("Verification Complete")
    log("-------------------------------------------------")
  }
};

module.exports.tags = ["all", "fundMe"];
