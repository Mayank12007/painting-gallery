import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gallerist_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gallerist_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Persist cart
  useEffect(() => {
    localStorage.setItem('gallerist_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('gallerist_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (painting, framing) => {
    const framingOption = framing || painting.framingOptions?.[0] || {
      id: 'rolled',
      name: 'Unframed Rolled Canvas',
      price: 0
    };

    const cartItemId = `${painting.id}_${framingOption.id}`;
    const unitPrice = painting.price + (framingOption.price || 0);

    setCartItems(prev => {
      const existsIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existsIndex > -1) {
        // Since original paintings are 1-of-1, limit quantity to 1 for originals
        return prev;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            painting,
            framing: framingOption,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateFraming = (cartItemId, newFraming) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newCartItemId = `${item.painting.id}_${newFraming.id}`;
          const newUnitPrice = item.painting.price + (newFraming.price || 0);
          return {
            ...item,
            cartItemId: newCartItemId,
            framing: newFraming,
            unitPrice: newUnitPrice,
            totalPrice: newUnitPrice * item.quantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code) => {
    const cleaned = (code || '').trim().toUpperCase();
    if (!cleaned) return;

    if (cleaned === 'GALLERIST10' || cleaned === 'ART10' || cleaned === 'FIRST10') {
      setCoupon(cleaned);
      setDiscountPercent(10);
      setCouponError('');
      return { success: true, message: '10% Collector Discount applied!' };
    } else if (cleaned === 'MASTERPIECE15') {
      setCoupon(cleaned);
      setDiscountPercent(15);
      setCouponError('');
      return { success: true, message: '15% Curators Discount applied!' };
    } else {
      setCouponError('Invalid coupon code. Try GALLERIST10');
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setCoupon('');
    setDiscountPercent(0);
    setCouponError('');
  };

  const toggleWishlist = (paintingId) => {
    setWishlist(prev => {
      if (prev.includes(paintingId)) {
        return prev.filter(id => id !== paintingId);
      } else {
        return [...prev, paintingId];
      }
    });
  };

  const isInWishlist = (paintingId) => wishlist.includes(paintingId);

  // Computations
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = 0; // Free Insured Gallery Shipping
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateFraming,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupon,
        discountPercent,
        discountAmount,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        shippingFee,
        grandTotal,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
