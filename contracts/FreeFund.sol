// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

// Adding only ERC-20 function that we use from DAI smart contract
interface DaiToken {
    function transfer(address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

contract meta {
    DaiToken daitoken;

    constructor() public{
        // daitoken = DaiToken(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa); // Kovan
        daitoken = DaiToken(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa); // Rinkeby
    }
}

contract FreeFund is meta {
    
    address public creator;
    uint public start = block.timestamp;
    uint public end = block.timestamp + 2629743; // default project funding period = 1 month 
    uint public target; // in Wei
    
    /*
    https://www.unixtimestamp.com/index.php
    Human Readable Unix timestampo converter
        Time                    Seconds
        1 Hour	                3600 Seconds
        1 Day	                86400 Seconds
        1 Week	                604800 Seconds
        1 Month (30.44 days)	2629743 Seconds
        1 Year (365.24 days)	31556926 Seconds
    */
    
    constructor (address _creator, uint _target) {
        // pass cretor address
        // pass target
        creator = _creator;
        target = _target;
    }

    // Creator needs to input the amount he wants to withdraw after the project is finished
    function withdraw(uint withdraw_amount) public onlyCreator {
        require(block.timestamp > end, "Project funds can only be withdrawn at the end of the project funding duration");
        // Send the amount to the requestor/ creator
        daitoken.transfer(msg.sender, withdraw_amount);
        emit Withdrawal(msg.sender, withdraw_amount);
    }

    event Withdrawal(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);

    modifier onlyCreator {
        require(msg.sender == creator, "Only the FreeFund project creator can call this function");
        _;
    }

}