'use client';

import React, { useState } from 'react';
import { Product, CartItem, PaymentMethod } from '../types/pos';
import { MOCK_PRODUCTS } from '../lib/api-client';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';

export default function PosPreview() {
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 2 },
    { product: MOCK_PRODUCTS[2], quantity: 1 },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [completedOrder, setCompletedOrder] = useState<{ id: string; total: number } | null>(null);

  const categories = ['All', 'Beverages', 'Bakery', 'Retail', 'Supplies'];

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesCat = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNum = `ND-${Math.floor(100000 + Math.random() * 900000)}`;
    setCompletedOrder({ id: orderNum, total });
    setCart([]);
  };

  return (
    <section id="pos-demo" style={{
      padding: '3rem 1.5rem 5rem 1.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="badge-rounded">Interactive Live Preview</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#000000',
        }}>
          Nuradesk POS Terminal
        </h2>
        <p style={{
          color: '#525252',
          marginTop: '0.5rem',
          fontSize: '1rem',
          maxWidth: '550px',
          margin: '0.5rem auto 0 auto',
        }}>
          Experience the clean layout, immediate item indexing, and responsive cart calculations.
        </p>
      </div>

      {/* POS Terminal Container (Strictly Black & White, No Shadow, Rounded) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #000000',
        borderRadius: '1.25rem',
        overflow: 'hidden',
      }}>
        {/* Terminal Top Bar */}
        <div style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              display: 'inline-block',
            }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              REGISTER #01 • MAIN COUNTER
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem' }}>
            <span style={{ opacity: 0.8 }}>Cashier: Alex V.</span>
            <span style={{
              borderLeft: '1px solid #404040',
              paddingLeft: '1rem',
              color: '#FFFFFF',
              fontWeight: 500,
            }}>
              Nuradesk Online
            </span>
          </div>
        </div>

        {/* Terminal Body Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          minHeight: '560px',
        }}>
          {/* Left Column: Product Catalog */}
          <div style={{
            padding: '1.5rem',
            borderRight: '1px solid #E5E5E5',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            {/* Search Bar & Filter */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid #000000',
                borderRadius: '1rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: '#FFFFFF',
              }}>
                <SearchRoundedIcon sx={{ fontSize: 18, color: '#737373' }} />
                <input
                  type="text"
                  placeholder="Search item or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'transparent',
                  }}
                />
              </div>

              {searchQuery && (
                <button
                  className="button-20-secondary button-20-sm"
                  onClick={() => setSearchQuery('')}
                  style={{ borderRadius: '1rem' }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: selectedCategory === cat ? '#000000' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : '#000000',
                    border: '1px solid #000000',
                    borderRadius: '1rem',
                    padding: '0.3rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.75rem',
              overflowY: 'auto',
              maxHeight: '400px',
              paddingRight: '0.25rem',
            }}>
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '1rem',
                    padding: '0.9rem 0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    transition: 'border-color 0.15s, background-color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.backgroundColor = '#FAFAFA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E5E5';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {product.sku}
                    </span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#000000', marginTop: '0.15rem' }}>
                      {product.name}
                    </h4>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.25rem',
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#000000' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                    }}>
                      <AddRoundedIcon sx={{ fontSize: 16 }} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Register Ticket & Order Summary */}
          <div style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA',
          }}>
            {/* Ticket Header */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #E5E5E5',
                marginBottom: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingCartRoundedIcon sx={{ fontSize: 20 }} />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#000000' }}>
                    Current Order ({cart.reduce((acc, i) => acc + i.quantity, 0)})
                  </span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#737373',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    Clear
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}>
                {cart.length === 0 ? (
                  <div style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: '#737373',
                    fontSize: '0.9rem',
                  }}>
                    Cart is empty. Tap any item on the left to add to register.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E5E5',
                        borderRadius: '0.75rem',
                        padding: '0.65rem 0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#000000' }}>
                          {item.product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#737373' }}>
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {/* Qty controls */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid #000000',
                          borderRadius: '1rem',
                          padding: '0.15rem 0.35rem',
                        }}>
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <RemoveRoundedIcon sx={{ fontSize: 14 }} />
                          </button>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <AddRoundedIcon sx={{ fontSize: 14 }} />
                          </button>
                        </div>

                        <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '55px', textAlign: 'right' }}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout & Calculations */}
            <div>
              {/* Payment Method Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#737373', marginBottom: '0.4rem' }}>
                  Payment Method
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      border: '1px solid #000000',
                      backgroundColor: paymentMethod === 'card' ? '#000000' : '#FFFFFF',
                      color: paymentMethod === 'card' ? '#FFFFFF' : '#000000',
                      borderRadius: '0.75rem',
                      padding: '0.5rem 0.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <CreditCardRoundedIcon sx={{ fontSize: 18 }} />
                    Card
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    style={{
                      border: '1px solid #000000',
                      backgroundColor: paymentMethod === 'cash' ? '#000000' : '#FFFFFF',
                      color: paymentMethod === 'cash' ? '#FFFFFF' : '#000000',
                      borderRadius: '0.75rem',
                      padding: '0.5rem 0.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <PaymentsRoundedIcon sx={{ fontSize: 18 }} />
                    Cash
                  </button>

                  <button
                    onClick={() => setPaymentMethod('qr_code')}
                    style={{
                      border: '1px solid #000000',
                      backgroundColor: paymentMethod === 'qr_code' ? '#000000' : '#FFFFFF',
                      color: paymentMethod === 'qr_code' ? '#FFFFFF' : '#000000',
                      borderRadius: '0.75rem',
                      padding: '0.5rem 0.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <QrCode2RoundedIcon sx={{ fontSize: 18 }} />
                    QR Pay
                  </button>
                </div>
              </div>

              {/* Bill Details */}
              <div style={{
                borderTop: '1px solid #E5E5E5',
                paddingTop: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#525252' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#525252' }}>
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: '#000000',
                  marginTop: '0.25rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #000000',
                }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Exact user button-20: Black and White, no shadow, no gradient, rounded */}
              <button
                className="button-20"
                role="button"
                style={{ width: '100%' }}
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                <ReceiptRoundedIcon sx={{ fontSize: 20 }} />
                <span>Complete Checkout (${total.toFixed(2)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Complete Modal / Receipt (Flat, rounded, no shadow) */}
      {completedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000000',
            borderRadius: '1.25rem',
            padding: '2rem',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              marginBottom: '1rem',
            }}>
              <CheckCircleRoundedIcon sx={{ fontSize: 36 }} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>
              Transaction Successful
            </h3>
            <p style={{ color: '#525252', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Receipt #{completedOrder.id} has been logged. Total charged: <strong>${completedOrder.total.toFixed(2)}</strong>.
            </p>

            <div style={{
              border: '1px dashed #000000',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.8rem',
              textAlign: 'left',
              color: '#525252',
            }}>
              <div><strong>System:</strong> Nuradesk POS Terminal 01</div>
              <div><strong>Status:</strong> Synced / Ready for .NET Ledger</div>
              <div><strong>Payment:</strong> {paymentMethod.toUpperCase()} APPROVED</div>
            </div>

            <button
              className="button-20"
              role="button"
              style={{ width: '100%' }}
              onClick={() => setCompletedOrder(null)}
            >
              Start New Order
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
