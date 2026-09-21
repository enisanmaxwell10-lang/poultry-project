import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'

const CART_KEY = 'greenfields_cart'
const BRANCH_KEY = 'greenfields_branch'

const CartContext = createContext(null)

function parsePrice(price) {
  const digits = String(price).replace(/[^\d.]/g, '')
  return digits ? parseFloat(digits) : 0
}

function formatNaira(number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  })
    .format(number)
    .replace('NGN', '₦')
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const [branchId, setBranchIdState] = useState(() => {
    try {
      return localStorage.getItem(BRANCH_KEY) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (branchId) localStorage.setItem(BRANCH_KEY, branchId)
    else localStorage.removeItem(BRANCH_KEY)
  }, [branchId])

  const setBranchId = useCallback((idOrFn) => {
    setBranchIdState((prev) => {
      const id = typeof idOrFn === 'function' ? idOrFn(prev) : idOrFn
      if (prev !== id) setItems([])
      return id
    })
  }, [])

  const addToCart = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          weight: product.weight,
          price: product.price,
          img: product.img,
          quantity: qty,
        },
      ]
    })
  }, [])

  const updateQuantity = useCallback((productId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product_id !== productId)
        : prev.map((i) => (i.product_id === productId ? { ...i, quantity: qty } : i))
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.product_id !== productId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const total = useMemo(
    () => items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0),
    [items]
  )

  const totalFormatted = useMemo(() => formatNaira(total), [total])

  const value = {
    items,
    count,
    total,
    totalFormatted,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    branchId,
    setBranchId,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}