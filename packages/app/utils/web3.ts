import { ethers, providers } from "ethers"
import { Interface, LogDescription } from "ethers/lib/utils"
// import axios from "axios"
import roundABI from '../abi/RoundImplementation.json'

export const loadApplicationMeta = async (hash: string) => loadIPFSJSON(hash)

export const loadIPFSJSON = async (hash: string) => {
  return fetch(`https://gitcoin.mypinata.cloud/ipfs/${hash}`).then((resp) => resp.json());
}

export const getEvents = async ({ address, sig, fromBlock, contractInterface, provider, params = [] }: {
  address: `0x${string}`
  sig: string
  fromBlock?: string
  provider: providers.Provider
  contractInterface?: Interface
  params?: any[]
}) => {

  // console.log({ sig: ethers.utils.id(sig) })

  const events = await provider.getLogs({
    address: address,
    fromBlock: fromBlock || "0x00",
    toBlock: "latest",
    topics: [
      ethers.utils.id(sig),
      ...params
    ]
  })

  if (contractInterface) {
    try {
      return events.map((e: providers.Log) => contractInterface.parseLog(e))
    } catch (error) {
      console.log(error, "Unable to parse logs using interface")
    }
  } else {
    return events
  }
}

export const getApplicationsForRound = async (roundAddress: `0x${string}`, provider: providers.Provider): Promise<LogDescription[]> => {
  const IRoundContract = new ethers.utils.Interface(roundABI)

  const events = await provider.getLogs({
    address: roundAddress,
    fromBlock: "0x00",
    toBlock: "latest",
    topics: [
      ethers.utils.id("NewProjectApplication(bytes32,(uint256,string))")
    ]
  })

  const decodedEvents = events.map((e) => IRoundContract.parseLog(e));
  
  return decodedEvents
}