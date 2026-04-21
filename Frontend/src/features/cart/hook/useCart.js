import { useDispatch, useSelector } from 'react-redux'
import { setItems, addItem, removeItem, clearCart, selectCartItems } from '../state/cart.slice.js'
import { addToCart as apiAddToCart, getCart as apiGetCart, removeFromCart as apiRemoveFromCart } from '../service/cart.api.js'

export const useCart = () => {
  const dispatch = useDispatch()
  const currentItems = useSelector(selectCartItems)
async function handleGetCart() {
  try {
    const data = await apiGetCart()

    const items = data?.cart?.items || []

    const normalized = items.map(item => ({
      _id: item._id,
      product: item.product?._id || item.product,
      variantId: item.variant?.toString() || item.variant || 'default',
      title: item.product?.title || '',
      image: item.product?.images?.[0]?.url || '',
      price: item.price?.amount ?? item.product?.price?.amount ?? 0,
      currency: item.price?.currency || item.product?.price?.currency || 'INR',
      quantity: item.quantity || 1,
      size: item.attributes?.size || '',
      color: item.attributes?.color || '',
    }))

    dispatch(setItems(normalized)) 
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}
async function handleAddToCart(productId, variantId, quantity = 1) {
  dispatch(addItem({ product: productId, variantId, quantity }))

  try {
    await apiAddToCart(productId, variantId, quantity)
  } catch (error) {
    console.error('Error adding to cart:', error)
    await handleGetCart() // rollback if failed
  }
}
async function handleRemoveFromCart(productId, variantId) {
  // Optimistic remove
  dispatch(removeItem({ product: productId, variantId }))
  try {
    await apiRemoveFromCart(productId, variantId)
  } catch (error) {
    console.error('Error removing from cart:', error)
    // Re-sync on failure
    await handleGetCart()
  }
}
async function handleClearCart() {
  dispatch(clearCart())
}
return { handleAddToCart, handleGetCart, handleRemoveFromCart, handleClearCart }
  
}