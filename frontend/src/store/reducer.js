import * as actionTypes from './actionTypes';


const initialState = {

}

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
        default:
            return state
    }
}

export default reducer;