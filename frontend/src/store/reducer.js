import * as actionTypes from './actionTypes';

const initialState = {
    selectedAddress: null,
    mobile: false,
    token : null,
    user : null,
    provider : null,
    signer : null,
  };

const reducer = ( state = initialState, action ) => {
    switch(action.type){
        case actionTypes.setSocket:
            return {
                ...state,
                socket : action.socket,
            }
        case actionTypes.onMobile:
            return {
                ...state,
                mobile : action.mobile,
            }

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
        case actionTypes.connectFactory:
            return {
                ...state,
                factory : action.factory,
            }

        case actionTypes.disconnectWallet:
            return {
                ...state,
                selectedAddress : undefined
            }

        case actionTypes.resetState:
            return {networkID : state.networkID, socket : state.socket , ...initialState};

        case actionTypes.setNetworkID:
            if(!window.ethereum.networkVersion){
                return state;
            }
            return {
                ...state,
                networkID : action.id,
            }

        case actionTypes.setToken:
            return {
                ...state,
                token : action.token,
            }

        case actionTypes.setUser:
            return {
                ...state,
                user : action.user,
            }

        default:
            return state
    }
}

export default reducer;