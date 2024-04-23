import { Fraction } from '@uniswap/sdk-core'
import { CallData, uint256 } from 'starknet'

import { EKUBO_POSITIONS_ADDRESSES } from '../constants/contracts'
import { LiquidityType, Selector } from '../constants/misc'
import { FactoryConfig } from '../factory'
import { Memecoin } from '../types'
import { decimalsScale } from '../utils/helpers'

export async function getEkuboFees(config: FactoryConfig, memecoin: Memecoin) {
  if (!memecoin.isLaunched || memecoin.liquidity.type !== LiquidityType.EKUBO_NFT || !memecoin.quoteToken) return

  const calldata = CallData.compile([memecoin.liquidity.ekuboId, memecoin.liquidity.poolKey, memecoin.liquidity.bounds])

  const { result } = await config.provider.callContract({
    contractAddress: EKUBO_POSITIONS_ADDRESSES[config.chainId],
    entrypoint: Selector.GET_TOKEN_INFOS,
    calldata,
  })

  const [fees0Low, fees0High, fees1Low, fees1High] = result

  const fees0 = uint256.uint256ToBN({ low: fees0Low, high: fees0High })
  const fees1 = uint256.uint256ToBN({ low: fees1Low, high: fees1High })

  return new Fraction(
    (new Fraction(memecoin.address).lessThan(memecoin.quoteToken.address) ? fees1 : fees0).toString(),
    decimalsScale(memecoin.quoteToken.decimals),
  )
}