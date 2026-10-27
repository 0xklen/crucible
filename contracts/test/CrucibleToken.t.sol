// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CrucibleToken} from "../src/CrucibleToken.sol";

contract CrucibleTokenTest is Test {
    CrucibleToken tok;
    address buyer = address(0xB0B);

    function setUp() public {
        tok = new CrucibleToken("Nova", "NOVA", 1 gwei);
        vm.deal(buyer, 100 ether);
    }

    function testBuyMintsAndRefundsDust() public {
        vm.prank(buyer);
        uint256 tokens = tok.buy{ value: 1 ether }(buyer, 0);
        assertGt(tokens, 0);
        assertEq(tok.balanceOf(buyer), tokens);

        uint256 cost = tok.costForTokens(tokens, 0);
        assertLe(cost, 1 ether, "curve never overcharges");
        // buyer paid exactly `cost`; the rest came back as refund dust
        assertEq(buyer.balance, 100 ether - cost);
    }

    function testSellRoundTripReturnsExactCost() public {
        vm.prank(buyer);
        uint256 tokens = tok.buy{ value: 1 ether }(buyer, 0);
        uint256 cost = tok.costForTokens(tokens, 0);

        vm.prank(buyer);
        uint256 ethOut = tok.sell(tokens);

        assertEq(ethOut, cost, "sell returns the exact buy cost at supply 0");
        assertEq(tok.totalSupply(), 0);
    }

    function testSellRespectsMinimumSlippage() public {
        vm.prank(buyer);
        uint256 tokens = tok.buy{ value: 1 ether }(buyer, 0);
        // demanding one more token than the curve allows must revert
        vm.prank(buyer);
        vm.expectRevert("slippage");
        tok.buy{ value: 0 }(buyer, tokens + 1);
    }

    function testSellCannotExceedBalance() public {
        vm.expectRevert("balance");
        tok.sell(1);
    }
}
