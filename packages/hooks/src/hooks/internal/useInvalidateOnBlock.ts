import { useBlockNumber } from '@starknet-react/core'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

/**
 * Invalidates the given query keys on every new block.
 */
export function useInvalidateOnBlock({
  enabled = true,
  queryKey,
  queryKeys,
}: {
  enabled?: boolean
  queryKey?: QueryKey
  queryKeys?: QueryKey[]
}) {
  const queryClient = useQueryClient()

  const prevBlockNumber = useRef<number | undefined>()

  const { data: blockNumber } = useBlockNumber({
    enabled,
  })

  useEffect(() => {
    if (blockNumber !== prevBlockNumber.current) {
      prevBlockNumber.current = blockNumber

      if (queryKey) {
        queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
      }

      if (queryKeys) {
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key }, { cancelRefetch: false })
        })
      }
    }
  }, [blockNumber, prevBlockNumber, queryClient, queryKey])
}
