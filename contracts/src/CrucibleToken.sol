// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title CrucibleToken
/// @notice A bonding-curve ERC-20. Price rises linearly with supply:
///         price(n) = K * n. buy() mints along the curve, sell() burns and
///         refunds. Deploy on Robinhood (chainId 4663); buyers act on the
///         contract address (CA) the deployer returns.
contract CrucibleToken {
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    /// Price slope in wei: the nth token costs K * n wei.
    uint256 public immutable K;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Buy(address indexed buyer, uint256 ethIn, uint256 tokensOut);
    event Sell(address indexed seller, uint256 tokensIn, uint256 ethOut);

    constructor(string memory name_, string memory symbol_, uint256 k) {
        name = name_;
        symbol = symbol_;
        K = k;
    }

    // ─── ERC-20 ────────────────────────────────────────────────────────────

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 a = allowance[from][msg.sender];
        require(a >= amount, "allowance");
        if (a != type(uint256).max) allowance[from][msg.sender] = a - amount;
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(balanceOf[from] >= amount, "balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        require(balanceOf[from] >= amount, "balance");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    // ─── Bonding curve ─────────────────────────────────────────────────────

    /// Buy along the curve. Mints the maximum tokens `cost(m) <= msg.value`
    /// allows and refunds the dust.
    function buy(address to, uint256 minTokens) external payable returns (uint256 tokens) {
        uint256 s = totalSupply;
        tokens = tokensForEth(msg.value, s);
        require(tokens >= minTokens, "slippage");
        require(tokens > 0, "zero");
        uint256 cost = costForTokens(tokens, s);
        _mint(to, tokens);
        emit Buy(to, cost, tokens);
        uint256 refund = msg.value - cost;
        if (refund > 0) {
            (bool ok, ) = msg.sender.call{ value: refund }("");
            require(ok, "refund");
        }
    }

    /// Sell along the curve. Burns `tokens` and refunds the top-of-curve
    /// value they represented.
    function sell(uint256 tokens) external returns (uint256 ethOut) {
        require(tokens > 0, "zero");
        require(balanceOf[msg.sender] >= tokens, "balance");
        ethOut = ethForTokens(tokens, totalSupply);
        _burn(msg.sender, tokens);
        emit Sell(msg.sender, tokens, ethOut);
        (bool ok, ) = msg.sender.call{ value: ethOut }("");
        require(ok, "transfer");
    }

    /// Max tokens mintable for `eth` wei when supply is `s`:
    /// solve  K*m*(2s + m + 1)/2 <= eth  for the largest integer m.
    function tokensForEth(uint256 eth, uint256 s) public view returns (uint256 m) {
        uint256 a = 2 * s + 1;
        uint256 disc = a * a + (8 * eth) / K;
        uint256 root = sqrt(disc);
        m = (root - a) / 2;
    }

    /// Cost in wei to mint `m` NEW tokens on top of supply `s`.
    function costForTokens(uint256 m, uint256 s) public view returns (uint256) {
        return (K * m * (2 * s + m + 1)) / 2;
    }

    /// Refund in wei for burning `m` tokens out of a supply of `s`.
    function ethForTokens(uint256 m, uint256 s) public view returns (uint256) {
        return (K * m * (2 * s - m + 1)) / 2;
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        if (x == 0) return 0;
        y = x;
        while (true) {
            uint256 z = (y + x / y) / 2;
            if (z >= y) break;
            y = z;
        }
    }

    receive() external payable {}
}
