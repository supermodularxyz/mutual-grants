/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import axios from 'axios';
import papaparse from "papaparse"
import { CartItem } from '../types/application'
// import { AnswerBlock } from '../types/application'
import { getAllStorageCart, removeFromStorageCart, clearStorageCart } from '../utils/storage';
import { downloadBlob } from '../utils/utils';

const RoundCard = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [email, setEmail] = useState<string>("")
  const [form, setForm] = useState<string>("")
  const [ sending, setSending ] = useState<boolean>(false)
  const { address } = useAccount();

  const updateCartList = useCallback(() => {
    const _cartList = getAllStorageCart()

    setCart(_cartList)
  }, [])

  const removeFromCart = (id: string) => () => {
    removeFromStorageCart(id)

    updateCartList()
  }

  const sendInvites = async () => {
    setSending(true)
    const projects = cart.map((i) => ({
      name: i.application.application.project.title,
      teamEmail: i.emailAnswer.answer
    }))

    try {
      await axios.post('/api/checkout', { projects, form, signer: address, replyTo: email })

      toast.success("Invites successfully sent")

      clearStorageCart()

    } catch (error) {
      console.log(error)

      toast.error("Error sending invites")
    }

    setSending(false)
    updateCartList()
  }

  const exportCSV = () => {
    const cartData = cart.map((item) => {
      const [chain, registry, projectId] = item.application.application.project.id.split(":")
      return ({
        title: item.application.application.project.title,
        description: item.application.application.project.description,
        project: `https://grantshub.gitcoin.co/#/chains/${chain}/registry/${registry}/projects/${projectId}`,
        email: item.emailAnswer.answer
    })})

    const csvData = papaparse.unparse(cartData)

    downloadBlob(csvData, "mutual-grants.csv", "text/csv;charset=utf-8;")

    clearStorageCart()
    updateCartList()
  }

  useEffect(() => {
    updateCartList()
  }, [updateCartList])

  return (<div className="mx-auto p-3 mt-16 text-center flex flex-1 flex-col items-center">
    <h3 className="mb-3 text-lg font-semibold">My Carts</h3>

    {cart.length === 0 && <div>Your Cart is Empty, start browsing some <Link href="/rounds" className='text-indigo-500'>rounds</Link> to get started</div>}


    {cart.length > 0 &&
      <>
        <ul role="list" className="w-full mx-auto">
          <div>{cart.map((cartItem) => {
            const [chain, registry, projectId] = cartItem.application.application.project.id.split(":")
            const { logoImg } = cartItem.application.application.project

            return (<li className="p-2 mb-3 border w-96 mx-auto" key={cartItem.id}>
              <div className='flex flex-1 flex-row'>
                <div>
                  <img src={logoImg ? `https://gitcoin.mypinata.cloud/ipfs/${logoImg}` : 'https://via.placeholder.com/150'} alt={cartItem.application.application.project.title} className="w-14 h-14 rounded" />
                </div>
                <div className="ml-3 flex-1 justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">
                    <a href={`https://grantshub.gitcoin.co/#/chains/${chain}/registry/${registry}/projects/${projectId}`} target="_blank" className="hover:underline focus:outline-none text-left line-clamp-1" rel="noreferrer">
                      {cartItem.application.application.project.title}
                    </a>

                  </h3>
                  <p className="mt-1 text-sm text-left text-gray-600 line-clamp-2">{cartItem.application.application.project.description}</p>
                  <div className='flex flex-1 justify-end mt-2'>
                    <button onClick={removeFromCart(cartItem.id)}>Remove from cart</button>
                  </div>
                </div>
              </div>
            </li>)
          })}</div>
        </ul>

        <div className='w-96 mt-8 mb-4 text-center'>
          <button onClick={exportCSV}>Export as CSV</button>

          <div className='w-full my-4 text-gray-400'>or</div>
        </div>
        <div className='w-96 mt-2 text-left mb-12'>
          <div className='mb-4'>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Email Address
            </label>
            <div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm"
                placeholder="me@email.com"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Google forms link
            </label>
            <div className="mt-1 border-b border-gray-300 focus-within:border-indigo-600">
              <input
                type="text"
                name="url"
                id="name"
                className="block w-full border-0 border-b border-transparent bg-gray-50 focus:border-indigo-600 focus:ring-0 sm:text-sm"
                placeholder="https://forms.gle/..."
                onChange={(e) => setForm(e.currentTarget.value)}
              />
            </div>
          </div>
          <div className='mt-4'>
            <button
              type="submit"
              disabled={cart.length === 0 || sending}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={sendInvites}
            >
              {sending ? "Sending..." : "Checkout"}
            </button>
          </div>
        </div>
      </>
    }

  </div>)
}

export default RoundCard
