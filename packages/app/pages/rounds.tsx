import { NextPage } from "next";
import React, { useState, useEffect, useCallback } from "react";
import { RoundMetaType } from '../utils/roundsUtil';
import { useAccount, useNetwork } from "wagmi";
import Link from "next/link";
import { loadIPFSJSON } from '../utils/web3';
import { useMyRoundsQuery } from "../gql/types.generated";
import _ from "lodash";

const Rounds: NextPage = () => {
  const [ rounds, setRounds ] = useState<RoundMetaType[]>()
  const [loading, setLoading] = useState<boolean>(true)
  const { address } = useAccount()
  const { chain } = useNetwork();
  const chainId = chain?.id || 1

  const { data: myProjects, loading: roundsLoading } = useMyRoundsQuery({
    context: {
      clientName: String(chainId)
    },
    variables: {
      address: (address as string || "").toLowerCase()
    }
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadRounds = useCallback(async () => {
    if (!roundsLoading) {
      if (myProjects?.roundAccounts && myProjects.roundAccounts.length > 0 ) {
        try {
          const allRounds = await Promise.all(_.uniqBy(myProjects.roundAccounts || [], "round.id").map(async (e) => {
            const program = await loadIPFSJSON(e.round.program.metaPtr.pointer as string)
            const round = await loadIPFSJSON(e.round.roundMetaPtr.pointer as string)
  
            return { program, round, roundAddress: e.round.id }
          })) as RoundMetaType[]
  
          setRounds(allRounds)
        } catch (error) {}
      }
      setLoading(false)
    }
  }, [myProjects, roundsLoading])

  useEffect(() => {
    loadRounds()
  }, [loadRounds])

  if (!address) {
    return <div className="mt-16 text-center w-full">Connect wallet to get started</div>
  }

  if (!roundsLoading && !loading && (!myProjects || myProjects?.roundAccounts.length === 0)) {
    return (<div className='w-full text-center mt-20'>
      No Rounds for this chain, switch networks and try again.
    </div>)
  }

  return (<div className="mx-auto p-3 mt-16 text-center flex flex-1 flex-col items-center">
    <h3 className="mb-3 text-lg font-semibold">My Rounds</h3>
    {loading ? <div>loading...</div> : rounds?.map((round) => <Link href={`/round/${chain?.id || "1"}/${round.roundAddress}`} key={round.roundAddress} className="w-96 flex flex-1 border justify-center p-3 mb-2">
      {round.program?.name && `${round.program?.name} | `}
      {round.round.name}
    </Link>)}
  </div>)
}

export default Rounds
