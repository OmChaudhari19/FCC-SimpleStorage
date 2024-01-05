// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PriceConvert.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    uint256 public constant minimumUsd = 50 * 1e18;

    using PriceConvert for uint256;

    address[] private s_funders;
    mapping(address => uint256) private s_adressToAmountFunded;
    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversion(s_priceFeed) >= minimumUsd,
            "Not Enough for Transaction!!"
        );
        s_funders.push(msg.sender);
        s_adressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 fundedIndex = 0;
            fundedIndex < s_funders.length;
            fundedIndex++
        ) {
            s_adressToAmountFunded[s_funders[fundedIndex]] = 0;
        }
        s_funders = new address[](0);

        // // transfer
        // payable(msg.sender).transfer(address(this).balance);
        // // send
        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send failed");
        // // call

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function Cheaperwithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            s_adressToAmountFunded[s_funders[funderIndex]] = 0;
        }
        s_funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        require(
            msg.sender == i_owner,
            "You are not Authorized to withdraw Funds."
        );
        _;
    }

    function gets_PriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getOnwer() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(
        address fundingAddress
    ) public view returns (uint256) {
        return s_adressToAmountFunded [fundingAddress];
    }
}
