// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {ConcaveToken} from "../src/ConcaveToken.sol";

/// @notice Deploy a ConcaveToken on Robinhood.
///         forge script script/Deploy.s.sol:Deploy --rpc-url $RPC --broadcast
///         Env: TOKEN_NAME (default "Nova"), TOKEN_SYMBOL (default "NOVA"),
///              CURVE_K wei (default 1 gwei).
contract Deploy is Script {
    function run() external returns (ConcaveToken token) {
        string memory name_ = vm.envOr("TOKEN_NAME", string("Nova"));
        string memory symbol_ = vm.envOr("TOKEN_SYMBOL", string("NOVA"));
        uint256 k = vm.envOr("CURVE_K", uint256(1 gwei));

        vm.startBroadcast();
        token = new ConcaveToken(name_, symbol_, k);
        vm.stopBroadcast();
    }
}
