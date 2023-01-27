import { ethers, providers } from 'ethers'
import { Interface, LogDescription } from 'ethers/lib/utils'
import { useCallback, useEffect, useState } from 'react'
import { useProvider } from 'wagmi'

type ParamTypes = {
  address: `0x${string}`
  sig: string
  chainId?: number
  contractInterface?: Interface
}

const useEvents = ({ address, sig, contractInterface, chainId = 1 }: ParamTypes) => {
  const [ events, setEvents] = useState<LogDescription[] | providers.Log[]>([])
  const provider = useProvider({ chainId })

  const getApplicationsForRound = useCallback(async() => {
    const events = await provider.getLogs({
      address: address,
      fromBlock: "0x00",
      toBlock: "latest",
      topics: [
        ethers.utils.id(sig)
      ]
    })

    if (contractInterface) {
      try {
        setEvents(events.map((e: providers.Log) => contractInterface.parseLog(e)))
      } catch (error) {
        console.log("Unable to parse logs using interface")
      }
    } else {
      setEvents(events)
    }
  }, [provider, address, contractInterface, sig])

  useEffect(() => {
    getApplicationsForRound() 
  }, [getApplicationsForRound])

  return events
}

export default useEvents
