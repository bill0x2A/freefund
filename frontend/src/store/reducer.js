import * as actionTypes from './actionTypes';

const initialState = {
    // The user's address and balance
    selectedAddress: undefined,
    mobile: false,
    // The ID about transactions being sent, and any possible error with them
  };

const reducer = ( state = initialState, action ) => {
    switch(action.type){
        case actionTypes.connectWallet:
            return {
                ...state,
                selectedAddress : action.selectedAddress
            }
        case actionTypes.connectProvider:
            return {
                ...state,
                provider : action.provider,
                signer   : action.provider.getSigner(),
            }
        case actionTypes.connectDaiContract:
            return {
                ...state,
                daiContract : action.contract,
            }
        case actionTypes.disconnectWallet:
            return {
                ...state,
                selectedAddress : undefined
            }
        case actionTypes.resetState:
            return initialState;
        case actionTypes.setNetworkID:
            console.log("NETWORK SWITCH DETECTED")
            if(!window.ethereum.networkVersion){
                return state;
            }
            return {
                ...state,
                networkID : action.id,
            }
        default:
            return state
    }
}

export default reducer;