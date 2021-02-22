export const rinkebyDaiAddress = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";

export const daiAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
  
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];

  export const mainContract = "";

  export const mainAbi = [
    
  ]