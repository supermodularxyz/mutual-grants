import type { NextPage } from 'next'
import Link from 'next/link'
import { useContracts } from '../providers/ContractsProvider/ContractProvider'


const Home: NextPage = () => {
  // const { readContracts, writeContracts } = useContracts();

  return (
    <>
      <div className="mx-auto p-3 mt-20 text-center">
        <div>
        Hello Mutual Grants. You can see list of round applications by using the format: /[chainId]/[roundAddress]
        </div>
        {/* <div className='mt-12'>
          Not sure where to start? Start here for the UNICEF round: <Link href="round/1/0xdf75054cd67217aEe44b4f9E4eBC651c00330938" className='text-blue-500'>round/1/0xdf75054cd67217aEe44b4f9E4eBC651c00330938</Link>
        </div> */}
      </div>
    </>
  )
}

export default Home
