import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BigNumberish, ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useProvider } from 'wagmi';
import axios from 'axios';
import { getApplicationsForRound, loadApplicationMeta } from '../../utils/web3';
import { RoundApplicationType, RoundApplicationData } from '../../types/application';

const Round: NextPage = () => {
  const router = useRouter()
  const { chainId, round } = router.query
  const [loading, setLoading] = useState<boolean>(true)
  const [applications, setApplications] = useState<RoundApplicationData[]>([])
  const provider = useProvider({ chainId: Number(chainId || '1') });

  const loadApplications = useCallback(async () => {
    const roundAddress = round as `0x${string}`
    setLoading(true)
    if (roundAddress && ethers.utils.isAddress(roundAddress)) {
      const apps = await getApplicationsForRound(roundAddress, provider)

      if (apps.length === 0) {
        setLoading(false)
      }

      const loadedApplications: RoundApplicationData[] = await Promise.all(apps.map((i) => {
        const { applicationMetaPtr } = i.args as unknown as RoundApplicationType
        return loadApplicationMeta(applicationMetaPtr.pointer)
      }))

      setApplications(loadedApplications);
    } else {
      // TODO : throw an error here
    }

    setLoading(false)
  }, [round, provider])

  useEffect(() => {
    if (provider) {
      loadApplications();
    }
  }, [provider, loadApplications])

  return (
    <>
      <nav className='flex flex-1 justify-between items-center px-3 mt-3 w-full'>
        <div>Mutual Grants</div>
        <ConnectButton />
      </nav>

      <div className="w-10/12 mx-auto p-3 my-20">
        {loading ? <div className='text-center w-full'>Loading...</div> : 
        <>
        <div className='flex flex-1 items-center justify-center mb-8'>
          <h2>{applications.length} Applications found for Grant round {round}</h2>
        </div>
        <div className="mt-6 flow-root">
          <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <li key={application.signature} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow p-2">
                <div>Image</div>
                <div className="relative">
                  <h3 className="text-sm font-semibold text-gray-800">
                    <a href={application.application.project.website} target="_blank" className="hover:underline focus:outline-none" rel="noreferrer">
                      {/* Extend touch target to entire panel */}
                      <span className="absolute inset-0" aria-hidden="true" />
                      {application.application.project.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{application.application.project.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        </>
        }
      </div>

    </>
  )
}

export default Round
