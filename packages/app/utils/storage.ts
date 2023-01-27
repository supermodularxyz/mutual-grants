import { CartItem } from '../types/application'

// cartKeys = [id1, id2, ... idx]

const cartKeysKey = 'cartKeys'
const cartPrefix = 'grants_'

export const getCartKeys = (): Set<string> => {
  const cartKeys = localStorage.getItem(cartKeysKey)
  return new Set(cartKeys ? JSON.parse(cartKeys) : [])
}

export const addToStorageCart = (key: string, value: string) => {
  const cartKeys = getCartKeys()
  const fullKey = `${cartPrefix}${key}`

  if (!cartKeys.has(fullKey)) {
    // add value to storage
    localStorage.setItem(fullKey, value)

    // add key to cart
    cartKeys.add(fullKey)
    localStorage.setItem(cartKeysKey, JSON.stringify(Array.from(cartKeys)))
  }
}

export const getStorageCartItem = (key: string): boolean => {
  const cartKeys = getCartKeys()
  const fullKey = `${cartPrefix}${key}`

  return cartKeys.has(fullKey)
}

export const getAllStorageCart = () => {
  const cartKeys = getCartKeys()

  return Array.from(cartKeys).map((key) => ({
    ...JSON.parse(localStorage.getItem(key) as string),
    id: key,
  })) as CartItem[]
}

export const removeFromStorageCart = (key: string, needsFullKey?: boolean) => {
  const cartKeys = getCartKeys()
  const fullKey = needsFullKey ? `${cartPrefix}${key}` : key

  if (cartKeys.has(fullKey)) {
    localStorage.removeItem(fullKey)

    cartKeys.delete(fullKey)

    localStorage.setItem(cartKeysKey, JSON.stringify(Array.from(cartKeys)))
  }
}

export const clearStorageCart = () => {
  Array.from(getCartKeys()).map((key) => localStorage.removeItem(key))
  localStorage.removeItem(cartKeysKey)
}
