import axios from 'axios'

const cartApi = axios.create({
  baseURL: '/api/cart',
  withCredentials: true,
})


export const addToCart = async (productId, variantId, quantity = 1) => {
  const response = await cartApi.post(`/add/${productId}/${variantId}`, { quantity })
  return response.data
}

export const getCart = async () => {
  const response = await cartApi.get('/')
  return response.data
}

export const removeFromCart = async (productId, variantId) => {
  const response = await cartApi.delete(`/remove/${productId}/${variantId}`)
  return response.data
}