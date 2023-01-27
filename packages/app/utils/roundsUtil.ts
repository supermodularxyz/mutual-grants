import { ethers, providers } from "ethers";
import roundImplementation from '../abi/RoundImplementation.json'
import programImplementation from '../abi/ProgramImplementation.json'
import { loadIPFSJSON } from "./web3";

export type RoundMetaPtrType = {
  name: string
  description?: string
  programContractAddress?: `0x${string}`
}

export type ProgramMetaPtrType = {
  name: string
}

export type RoundMetaType = {
  round: RoundMetaPtrType
  roundAddress: `0x${string}`
  program?: ProgramMetaPtrType
  // programAddress?: `0x${string}`
}



export const roundsFactoryContract = (chainId: number): `0x${string}` => {
  switch (chainId) {
    case 1: {
      return "0xE2Bf906f7d10F059cE65769F53fe50D8E0cC7cBe";
    }
    // case ChainId.OPTIMISM_MAINNET_CHAIN_ID: {
    //   address = "0x0f0A4961274A578443089D06AfB9d1fC231A5a4D";
    //   break;
    // }
    // case ChainId.FANTOM_MAINNET_CHAIN_ID: {
    //   address = "0x3e7f72DFeDF6ba1BcBFE77A94a752C529Bb4429E";
    //   break;
    // }
    // case ChainId.FANTOM_TESTNET_CHAIN_ID: {
    //   address = "0x00F51ba2Cd201F4bFac0090F450de0992a838762";
    //   break;
    // }
    case 5:
    default: {
      return "0x5770b7a57BD252FC4bB28c9a70C9572aE6400E48";
      break;
    }
  }
}


export const loadRoundMeta = async (address: `0x${string}`, provider: providers.Provider) => {
  const roundContract = new ethers.Contract(address, roundImplementation, provider)
  
  const { pointer }: { pointer: string } = await roundContract.roundMetaPtr()
  
  const roundMetaPtr: RoundMetaPtrType = await loadIPFSJSON(pointer)
  const resp: RoundMetaType = { round: roundMetaPtr, roundAddress: address }
  
  if (roundMetaPtr.programContractAddress) {
    // load program 
    const programContract = new ethers.Contract(roundMetaPtr.programContractAddress, programImplementation, provider)

    const { pointer: programMetaPointer }: { pointer: string } = await programContract.metaPtr()

    const programMetaPtr: ProgramMetaPtrType = await loadIPFSJSON(programMetaPointer)
    resp.program = programMetaPtr
    // resp.programAddress = roundMetaPtr.programContractAddress
  }

  return resp
}