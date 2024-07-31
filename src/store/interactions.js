import { ethers } from 'ethers'
import LEVERAGE_ABI from '../abis/Leverage.json';

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum)
  dispatch({ type: 'PROVIDER_LOADED', connection })

  return connection
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch({ type: 'NETWORK_LOADED', chainId })

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])

  dispatch({ type: 'ACCOUNT_LOADED', account })

  return account
}

export const loadTournament = async (provider, address, dispatch) => {
  let tournament, promoter

  tournament = new ethers.Contract(address, LEVERAGE_ABI, provider)
  promoter = await tournament.promoter()
  dispatch({ type: 'TOURNAMENT_LOADED', tournament, promoter })

  return token
}

export const addContract = (address) => {
  return {
    type: 'CONTRACT_ADDED',
    address
  };
};