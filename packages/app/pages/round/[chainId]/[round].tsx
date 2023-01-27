/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { LogDescription } from 'ethers/lib/utils'
import { useContractReads, useProvider } from 'wagmi'
import { RoundCard } from '../../../components'
import { RoundApplicationData, RoundApplicationType } from '../../../types/application'
import RoundImplementation from "../../../abi/RoundImplementation.json"
import { getEvents, loadApplicationMeta } from '../../../utils/web3'
import { useMyProjectsQuery } from '../../../gql/types.generated';

const RoundInterface = new ethers.utils.Interface(RoundImplementation)

const Round: NextPage = () => {
  const router = useRouter()
  const { round, chainId } = router.query
  const [loading, setLoading] = useState<boolean>(true)
  const [applications, setApplications] = useState<RoundApplicationData[]>([])
  const provider = useProvider({ chainId: chainId as unknown as number || 1 })

  const { data: myProjects, loading: projectsLoading } = useMyProjectsQuery({
    context: {
      clientName: chainId
    },
    variables: {
      id: round as string
    }
  })

  console.log({ chainId, myProjects, round })

  const loadApplications = useCallback(async () => {
    if (!projectsLoading) {
      if (myProjects?.rounds[0] && myProjects.rounds[0]?.projects && myProjects.rounds[0]?.projects.length > 0) {
        try {
          const loadedApplications = await Promise.all((myProjects.rounds[0].projects).map(async (project) => loadApplicationMeta(project.metaPtr.pointer as string)))
  
          setApplications(loadedApplications)
        } catch (e) {
          console.log(e)
        }
      }
      setLoading(false)
    }
  }, [myProjects, projectsLoading])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  if (!projectsLoading && !loading && applications.length === 0) {
    return (<div className='w-full text-center mt-20'>
      No applications for this round.
    </div>)
  }

  return (<div className="mx-auto p-3 mt-10 text-center flex flex-1 flex-col items-center">
    <div className="w-10/12 mx-auto p-3 mb-20">
      {loading ? <div>Loading...</div> : <>
        <div className='flex flex-1 items-center justify-center mb-8'>
          <h2>{applications.length} Applications found for Grant round {round}</h2>
        </div>
        <div className="mt-6 w-1/2 flow-root mx-auto">
          <ul role="list" className="w-full">
            {applications.map((application, i) => (
              <RoundCard application={application} round={round as unknown as `0x${string}`} provider={provider} key={`${application.signature}-${i}`} />
            ))}
          </ul>
        </div>
      </>}
    </div>
  </div>)
}

export default Round
