import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ApplicationSlice, createApplicationSlice } from './application'
import { ContractsSlice, createContractsSlice } from './contracts'
import { createLaunchSlice, LaunchSlice } from './launch'
import { createTransactionSlice, TransactionSlice } from './transaction'

export type StoreState = ApplicationSlice & ContractsSlice & LaunchSlice & TransactionSlice

const PERSISTING_KEYS: (keyof StoreState)[] = ['deployedTokenContracts']

export const useBoundStore = create<StoreState>()(
  persist(
    immer<StoreState>((...a) => ({
      ...createApplicationSlice(...a),
      ...createContractsSlice(...a),
      ...createLaunchSlice(...a),
      ...createTransactionSlice(...a),
    })),
    {
      name: 'unruggable-state-storage-v0.1.6', // bump version after breaking changes
      partialize: (state: StoreState) =>
        PERSISTING_KEYS.reduce<StoreState>((acc, key) => {
          ;(acc as any)[key] = state[key]
          return acc
        }, {} as StoreState),
    },
  ),
)
