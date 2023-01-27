/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useState } from 'react'
import { ethers, providers } from 'ethers'
import { toast } from 'react-toastify';
import { RoundApplicationData } from '../types/application'
import { Lit } from '../utils/lit'
import { AnswerBlock } from '../types/application'
import { useNetwork } from 'wagmi'
import { addToStorageCart, removeFromStorageCart, getStorageCartItem } from '../utils/storage';

// const VoteStrategyInterface = new ethers.utils.Interface(VoteStrategyABI)

type RoundCardType = {
  application: RoundApplicationData
  provider: providers.Provider
  round: `0x${string}`
}

const RoundCard = ({ application, provider, round }: RoundCardType) => {
  const [ isInCart, setIsInCart ] = useState<boolean>(false)

  const [chain, registry, projectId] = application.application.project.id.split(":")
  const { chains } = useNetwork()

  const roundChain = chains.find((c) => String(c.id) === chain)

  const { logoImg } = application.application.project

  const decryptAnswers = async () => {
    let _answerBlock = application.application.answers.find((answer) => answer.question === "Email Address") as AnswerBlock

    const PREFIX = "data:application/octet-stream;base64";

    if (_answerBlock?.encryptedAnswer) {
      try {
        const encryptedAnswer = _answerBlock.encryptedAnswer;
        const base64EncryptedString = [
          PREFIX,
          encryptedAnswer.ciphertext,
        ].join(",");

        const response = await fetch(base64EncryptedString);
        const encryptedString: Blob = await response.blob();

        const lit = new Lit({
          chain: (roundChain?.name as string).toLowerCase(),
          contract: ethers.utils.getAddress(round as string),
        });

        const decryptedString = await lit.decryptString(
          encryptedString,
          encryptedAnswer.encryptedSymmetricKey
        );

        _answerBlock = {
          ..._answerBlock,
          answer: decryptedString,
        };
      } catch (error) {
        console.error("decryptAnswers", error);

        _answerBlock = {
          ..._answerBlock,
          answer: "N/A",
        };
      }
    }

    return _answerBlock;
  };

  const updateCartStatus = useCallback(() => {
    setIsInCart(getStorageCartItem(application.application.project.id))
  }, [application])

  const addToCart = async () => {
    const emailAnswer = await decryptAnswers();

    addToStorageCart(application.application.project.id, JSON.stringify({ emailAnswer, application }));

    updateCartStatus()

    toast.success(`Added project to cart: ${application.application.project.title}`)
  }

  const removeFromCart = () => {
    removeFromStorageCart(application.application.project.id, true)

    updateCartStatus()

    toast.success(`Removed project from cart: ${application.application.project.title}`)
  }

  useEffect(() => {
    updateCartStatus()
  }, [updateCartStatus])

  return (<li className="p-2 mb-3 border">
    <div className='flex flex-1 flex-row'>
      <div>
        <img src={logoImg ? `https://gitcoin.mypinata.cloud/ipfs/${logoImg}` : 'https://via.placeholder.com/150'} alt={application.application.project.title} className="w-14 h-14 rounded" />
      </div>
      <div className="ml-3 flex-1 justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          {/* <a href={application.application.project.website} target="_blank" className="hover:underline focus:outline-none text-left line-clamp-1" rel="noreferrer"> */}
          <a href={`https://grantshub.gitcoin.co/#/chains/${chain}/registry/${registry}/projects/${projectId}`} target="_blank" className="hover:underline focus:outline-none text-left line-clamp-1" rel="noreferrer">
            {application.application.project.title}
          </a>

        </h3>
        <p className="mt-1 text-sm text-left text-gray-600 line-clamp-2">{application.application.project.description}</p>
        <div className='flex flex-1 justify-end mt-2'>
          {<button onClick={isInCart ? removeFromCart : addToCart}>{isInCart ? "Remove from" : "Add to"} Cart</button>}
        </div>
      </div>
    </div>
  </li>)
}

export default RoundCard
