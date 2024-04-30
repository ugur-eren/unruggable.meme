import { Fraction } from '@uniswap/sdk-core'
import { constants, RpcProvider } from 'starknet'
import { describe, expect, test } from 'vitest'

import * as TestData from '../../test/TestData'
import { Factory } from './default'

const provider = new RpcProvider({
  nodeUrl: 'https://starknet-mainnet.public.blastapi.io',
})

const factory = new Factory({ provider, chainId: constants.StarknetChainId.SN_MAIN })

describe('Default Factory', () => {
  describe('Wrong Address', () => {
    test('Memecoin', async () => {
      await expect(factory.getMemecoin('0x')).rejects.toThrow()
    })
  })

  describe('Not Launched', () => {
    test('Base Memecoin', async () => {
      const baseMemecoin = await factory.getBaseMemecoin(TestData.notLaunched.address)

      expect(baseMemecoin).toBeDefined()
      expect(baseMemecoin).toEqual(TestData.notLaunched.baseMemecoin)
    })

    test('Launch Data', async () => {
      const launchData = await factory.getMemecoinLaunchData(TestData.notLaunched.address)

      expect(launchData).toMatchObject(TestData.notLaunched.launchData)
    })
  })

  describe('Launched', () => {
    test('Base Memecoin', async () => {
      const baseMemecoin = await factory.getBaseMemecoin(TestData.launched.address)

      expect(baseMemecoin).toBeDefined()
      expect(baseMemecoin).toEqual(TestData.launched.baseMemecoin)
    })

    test('Launch Data', async () => {
      const launchData = await factory.getMemecoinLaunchData(TestData.launched.address)

      expect(launchData).toMatchObject(TestData.launched.launchData)
    })

    test('Ekubo Fees', async () => {
      const memecoin = await factory.getMemecoin(TestData.launched.address)

      expect(memecoin).toBeDefined()
      if (!memecoin) return

      const ekuboFees = await factory.getEkuboFees(memecoin)

      expect(ekuboFees).toBeInstanceOf(Fraction)
    })
  })
})
