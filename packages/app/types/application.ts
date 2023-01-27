import { BigNumberish } from "ethers"

export type RoundApplicationType = {
  project: string
  applicationMetaPtr: {
    protocol: BigNumberish
    pointer: string
  }
}

type Answer = {
  answer?: string
  question: string
  questionId: number
  encryptedAnswer?: {
    ciphertext: string
    encryptedSymmetricKey: string
  }
}

export type RoundApplicationData = {
  signature: `0x${string}`
  application: {
    round: `0x${string}`
    recipient: `0x${string}`
    answers: Answer[]
    project: {
      lastUpdated: number
      createdAt: number
      id: string
      title: string
      description: string
      website: string
      bannerImg?: string
      logoImg?: string
      metaPtr: {
        protocol: string
        pointer: string
      }
      userGithub?: string
      projectGithub?: string
      projectTwitter?: string
      credentials: {}
    }
  }
}

export type AnswerBlock = {
  questionId: number;
  question: string;
  answer?: string;
  encryptedAnswer?: {
    ciphertext: string;
    encryptedSymmetricKey: string;
  };
};

export type CartItem = {
  id: string
  emailAnswer: AnswerBlock
  application: RoundApplicationData
}