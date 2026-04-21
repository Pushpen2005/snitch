import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], 
    loading: false,
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload
    },
    addItem(state, action) {
      const incoming = action.payload
      const existing = state.items.find(
        i => i.product === incoming.product && i.variantId === incoming.variantId
      )
      if (existing) {
        existing.quantity += incoming.quantity || 1
      } else {
        state.items.push({ ...incoming, quantity: incoming.quantity || 1 })
      }
    },

    // Remove by product+variantId pair (or by _id if from server)
    removeItem(state, action) {
      const payload = action.payload
      if (typeof payload === 'object' && payload.product) {
        state.items = state.items.filter(
          i => !(i.product === payload.product && i.variantId === payload.variantId)
        )
      } else {
       
        state.items = state.items.filter(i => i._id !== payload)
      }
    },

    
    updateQuantity(state, action) {
      const { product, variantId, quantity } = action.payload
      const item = state.items.find(
        i => i.product === product && i.variantId === variantId
      )
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    },

    clearCart(state) {
      state.items = []
    },

    setLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setItems, addItem, removeItem, updateQuantity, clearCart, setLoading } = cartSlice.actions
export default cartSlice.reducer

// ── Selectors ──
export const selectCartItems = state => state.cart.items
export const selectCartCount = state => state.cart.items.reduce((acc, i) => acc + (i.quantity || 0), 0)
export const selectCartTotal = state =>
  state.cart.items.reduce((acc, i) => acc + (Number(i.price) || 0) * (i.quantity || 1), 0)
export const selectCartLoading = state => state.cart.loading