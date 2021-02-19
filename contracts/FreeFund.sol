// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// Adding only ERC-20 DAI functions that we need
interface DaiInterface {
    function transfer(address dst, uint wad) external returns (bool);
    function balanceOf(address guy) external view returns (uint);
}

contract Dai {
    DaiInterface daitoken;

    constructor() {
        // daitoken = DaiToken(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa);     // Kovan
        daitoken = DaiInterface(0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa);    // Rinkeby
    }
}

contract FreeFund is Dai {

    // // mapping of supporters and their total amount of donated DAI
    // // uint needs to me mapped to dai balance!  
    // mapping (address => uint) public supporters; // 'public' for testing purposes, make 'private' in prod
     
    address public creator = msg.sender; // can withdraw funds after the successful is successfully funded and finished
    
    uint public start = block.timestamp;
    
    // uint public end = block.timestamp + 2629743; // default project funding period = 1 month 
    uint public end = block.timestamp + 60; // 1 min 
    // uint public end; 
    
    uint public target = 10 * 1e18; // hardcoded target = 10 DAI 
    
    // how to fetch the current balance in DAI on the same smart contract ??
    // uint public balance;
        
    // FE needs to pass variables into constructor
    // on submit pass variables
    // trigger deployment script
    constructor (/*uint _target*/) {
        // creator = _creator;          // creator is msg.sender!

        // target = _target * 1e18;     // in ether 10^18 or 1e18
        // target = _target * 10 *1e18; // hardcoded target = 10 DAI
        
        // end = _end;                  // unix timestamp format. Example: 1613753999 = 19/02/2021 16:55 (UTC)
    }

    // Creator needs to input the amount he wants to withdraw after the project is finished
    function withdrawAllFunds() public onlyCreator {
        
        // check if the project funding period has ended already
        require(block.timestamp > end, "Project funds can only be withdrawn at the end of the project funding duration");
        
        // check if gathered donations are equal or bigger than the set minimum target
        require(daitoken.balanceOf(address(this)) >= target, "the project has not reach the funding target");
        
        // if both checks abot are positive, the creator can withdraw the total donation amount
        uint totalBalance = daitoken.balanceOf(address(this));        
        daitoken.transfer(msg.sender, totalBalance);
        emit Withdrawal(msg.sender, totalBalance);
    }
    
    /*
    
    // in case the minimum funding target was not reached at the end of the funding project,
    // give all DAI back to supporters
    function revertDonations() internal {
        if (block.timestamp > end && daitoken.balanceOf(address(this)) < target) {
            // revert all DAI back to the individual suporters according to mapping
        } 
    }

    // in case the project is funded, but the creator does not withdraw within 60 days,
    // funds should also return to supporters in order to not be locked in the SC forever
    
    */
    
    event Withdrawal(address indexed to, uint amount);
    event Deposit(address indexed from, uint amount);
    
    // show DAI balance of SC  
    function balanceDai() public view returns(uint) {
        // return DAI balance on this SC
        return daitoken.balanceOf(address(this));
    }
    
    // get SC address
    function getSmartContractAddress() public view returns(address) {
        return address(this);
    }
    
    // get current timestamp
    function getCurrentTimeStamp() public view returns(uint) {
        return block.timestamp;
    }

    // modifier so that only the project creator can call certain functions
    modifier onlyCreator {
        require(msg.sender == creator, "Only the FreeFund project creator can call this function");
        _;
    }

}
