import { Percent } from '@uniswap/sdk-core'

import { AMM } from '../constants/amms'
import { LiquidityType } from '../constants/misc'
import { Token } from './tokens'

type i129 = {
  mag: string
  sign: string
}

type EkuboPoolKey = {
  token0: string
  token1: string
  fee: string
  tickSpacing: string
  extension: string
}

type EkuboBounds = {
  lower: i129
  upper: i129
}

type BaseLiquidity = {
  type: LiquidityType
  lockManager: string
  unlockTime: number
  owner: string
  quoteToken: string
}

export type JediswapLiquidity = {
  type: LiquidityType.JEDISWAP_ERC20 | LiquidityType.STARKDEFI_ERC20
  lockPosition: string
  quoteAmount: string
} & Omit<BaseLiquidity, 'type'>

export type EkuboLiquidity = {
  type: LiquidityType.EKUBO_NFT
  ekuboId: string
  startingTick: number
  poolKey: EkuboPoolKey
  bounds: EkuboBounds
} & Omit<BaseLiquidity, 'type'>

type LaunchedLiquidity = JediswapLiquidity | EkuboLiquidity

export type BaseMemecoin = {
  address: string
  name: string
  symbol: string
  owner: string
  decimals: number
  totalSupply: string
}

export type LaunchedMemecoin =
  | {
      isLaunched: false
    }
  | {
      isLaunched: true
      quoteToken: Token | undefined
      launch: {
        teamAllocation: string
        blockNumber: number
      }
      liquidity: LaunchedLiquidity
    }

export type Memecoin = BaseMemecoin & LaunchedMemecoin

export type DeployData = {
  name: string
  symbol: string
  owner: string
  initialSupply: string | string
}

type MemecoinBaseLaunchData = {
  amm: AMM
  teamAllocations: {
    address: string
    amount: number | string
  }[]
  holdLimit: Percent

  /**
   * Anti bot period in *seconds*
   */
  antiBotPeriod: number

  /**
   * Quote token
   */
  quoteToken: Token

  /**
   * Starting market cap in USDC
   */
  startingMarketCap: number | string
}

export type EkuboLaunchData = MemecoinBaseLaunchData & {
  fees: Percent
}

export type StandardAMMLaunchData = MemecoinBaseLaunchData & {
  liquidityLockPeriod: number
}
