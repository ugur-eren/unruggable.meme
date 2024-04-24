import {
  AMM,
  DEFAULT_QUOTE_TOKEN_ADDRESSES,
  MAX_LIQUIDITY_LOCK_PERIOD,
  MAX_TRANSFER_RESTRICTION_DELAY,
} from 'core/constants'
import { constants, getChecksumAddress } from 'starknet'
import { StateCreator } from 'zustand'

import { StoreState } from './index'

export type LaunchSlice = State & Actions

export interface Holder {
  address: string
  amount: string
}

type TeamAllocation = Record<number, Holder>

interface State {
  hodlLimit: string | null
  antiBotPeriod: number
  liquidityLockPeriod: number
  startingMcap: string | null
  teamAllocation: TeamAllocation
  amm: AMM
  quoteTokenAddress: string
  ekuboFees: string | null
}

interface Actions {
  setHodlLimit: (hodlLimit: string) => void
  setAntiBotPeriod: (antiBotPeriod: number) => void
  setLiquidityLockPeriod: (liquidityLockPeriod: number) => void
  setStartingMcap: (startingMcap: string | null) => void
  setAMM: (amm: AMM) => void
  setTeamAllocationHolder: (holder: Holder, index: number) => void
  removeTeamAllocationHolder: (index: number) => void
  resetLaunchForm: () => void
  setEkuboFees: (ekuboFees: string) => void
  setQuoteTokenAddress: (quoteTokenAddress: string) => void
}

const initialState = {
  hodlLimit: null,
  antiBotPeriod: MAX_TRANSFER_RESTRICTION_DELAY,
  liquidityLockPeriod: MAX_LIQUIDITY_LOCK_PERIOD,
  startingMcap: null,
  teamAllocation: {},
  amm: AMM.EKUBO, // we don't really care about this value
  quoteTokenAddress: getChecksumAddress(DEFAULT_QUOTE_TOKEN_ADDRESSES[constants.StarknetChainId.SN_MAIN]),
  ekuboFees: null,
}

export const createLaunchSlice: StateCreator<StoreState, [['zustand/immer', never]], [], LaunchSlice> = (set) => ({
  ...initialState,

  setHodlLimit: (hodlLimit) => set({ hodlLimit }),
  setAntiBotPeriod: (antiBotPeriod) => set({ antiBotPeriod }),
  setLiquidityLockPeriod: (liquidityLockPeriod) => set({ liquidityLockPeriod }),
  setStartingMcap: (startingMcap) => set({ startingMcap }),
  setAMM: (amm) => set({ amm }),
  setEkuboFees: (ekuboFees) => set({ ekuboFees }),
  setQuoteTokenAddress: (quoteTokenAddress) => set({ quoteTokenAddress }),

  setTeamAllocationHolder: (holder: Holder, index: number) =>
    set((state) => {
      state.teamAllocation[index] = holder
    }),
  removeTeamAllocationHolder: (index: number) =>
    set((state) => {
      delete state.teamAllocation[index]
      return state
    }),
  resetLaunchForm: () => set({ ...initialState }),
})
