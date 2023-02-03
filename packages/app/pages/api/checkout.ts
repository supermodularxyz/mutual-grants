// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as postmark from "postmark"

const client = new postmark.ServerClient(process.env.postmarkAPI as string)

const craftMessage = (project: string, email: string, form: string, replyTo: string): postmark.Message => {
  return {
    To: email,
    // From: 'MutualGrants Invite <invite@mutualgrants.party>',
    From: 'MutualGrants Invite <hi@don3.xyz>',
    ReplyTo: replyTo,
    Subject: `📩 MutualGrants invite for ${project} team`,
    HtmlBody: `<p>You have been invited to apply for a mutual grant. Click <a href="${form}">here</a> to get started.</p>`,
    MessageStream: "broadcast"
  }
}

type Projects = {
  name: string
  teamEmail: string
}

interface ExtendedNextAPIRequest extends NextApiRequest {
  body: {
    projects: Projects[]
    form: string
    signer: `0x${string}`
    replyTo: string
  }
}

type Response = {
  message: string
}

export default async function handler(
  req: ExtendedNextAPIRequest,
  res: NextApiResponse<Response>
) {

  if (req.method !== "POST") {
    return res.status(400)
  }
  
  const { projects, form, replyTo } = req.body

  try {
    await Promise.all(projects.map(({ name, teamEmail }) => client.sendEmail(craftMessage(name, teamEmail, form, replyTo))))
  
    // use Email API to send
    res.status(200).json({ message: 'Successful' })
  } catch (error) {
    console.log(error)

    res.status(400).json({ message: "Failed" })
  }
}
