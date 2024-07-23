export const provider = (state = {}, action) => {
  switch (action.type) {
    case 'PROVIDER_LOADED':
      return {
        ...state,
        connection: action.connection
      }
    case 'NETWORK_LOADED':
      return {
        ...state,
        chainId: action.chainId
      }
    case 'ACCOUNT_LOADED':
      return {
        ...state,
        account: action.account
      }

    default:
      return state
  }
}

const initialState = {
  loaded: false,
  contracts: []
};

export const tournaments = (state = initialState, action) => {
  switch (action.type) {
    case 'TOURNAMENT_LOADED':
      return {
        ...state,
        loaded: true,
        contract: [...state.contracts, action.address]
      }
      default:
        return state
  }
}
