'use client';

import React, { useState, useEffect, useMemo } from 'react';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export interface StoreOffer {
  id: string;
  title: string;
  code?: string; // Optional coupon code (e.g., 'SAVE10', 'COMBO25')
  description: string;
  badgeText: string; // e.g. '20% OFF', 'SPECIAL'
  discountType: 'percentage' | 'fixed_amount' | 'promo_price';
  discountValue: number; // e.g., 20 (%) or 50 (₹) or promo target price
  appliesTo: 'all' | 'category' | 'products';
  targetCategories?: string[]; // e.g., ['Burgers', 'Beverages']
  targetProductIds?: string[]; // e.g., ['1', '2']
  minSubtotal?: number; // e.g. 200
  maxDiscount?: number; // e.g. 100
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
  usageCount: number;
  maxUsageLimit?: number; // e.g., 100
  createdAt: string;
}

// Initial default offers for immediate POS demonstration
const DEFAULT_OFFERS: StoreOffer[] = [
  {
    id: 'offer-1',
    title: 'Weekend Mega Discount',
    code: 'WEEKEND20',
    description: 'Flat 20% off on all items across the store this weekend.',
    badgeText: '20% OFF',
    discountType: 'percentage',
    discountValue: 20,
    appliesTo: 'all',
    minSubtotal: 150,
    startDate: '2026-09-01',
    endDate: '2026-10-31',
    isActive: true,
    usageCount: 42,
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'offer-2',
    title: 'Beverages Happy Hour',
    description: 'Get ₹30 flat deduction on all fresh beverages and coffee drinks.',
    badgeText: 'SAVE ₹30',
    discountType: 'fixed_amount',
    discountValue: 30,
    appliesTo: 'category',
    targetCategories: ['Beverages', 'Coffee', 'Drinks'],
    minSubtotal: 100,
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    isActive: true,
    usageCount: 19,
    createdAt: '2026-09-15T09:30:00.000Z',
  },
  {
    id: 'offer-3',
    title: 'Special Meal Deal',
    description: 'Combo special deal pricing for participating signature lunch items.',
    badgeText: 'DEAL ₹99',
    discountType: 'promo_price',
    discountValue: 99,
    appliesTo: 'all',
    startDate: '2026-08-01',
    endDate: '2026-09-20',
    isActive: false,
    usageCount: 88,
    createdAt: '2026-08-01T08:00:00.000Z',
  },
];

export default function OffersManagement({ theme }: { theme: any }) {
  // Store Offers State
  const [offers, setOffers] = useState<StoreOffer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Available Store Categories & Products (loaded from localStorage for targeting)
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableProducts, setAvailableProducts] = useState<{ id: string; name: string; price: number }[]>([]);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'percentage' | 'fixed_amount' | 'promo_price'>('all');

  // Full-page form view state (replaces popup/modal)
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  // Form Field States
  const [formTitle, setFormTitle] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('20% OFF');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'fixed_amount' | 'promo_price'>('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(20);
  const [formAppliesTo, setFormAppliesTo] = useState<'all' | 'category' | 'products'>('all');
  const [formTargetCategories, setFormTargetCategories] = useState<string[]>([]);
  const [formTargetProductIds, setFormTargetProductIds] = useState<string[]>([]);
  const [formMinSubtotal, setFormMinSubtotal] = useState<string>('');
  const [formMaxDiscount, setFormMaxDiscount] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formMaxUsageLimit, setFormMaxUsageLimit] = useState<string>('');

  // Reusable input styling for clean, simple fields
  const fieldInputStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    padding: '0 0.85rem',
    borderRadius: '0.6rem',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
    color: theme.textPrimary,
    fontSize: '13px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    outline: 'none',
  };

  // Load offers from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nuradesk_offers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOffers(parsed);
        } else {
          setOffers(DEFAULT_OFFERS);
          localStorage.setItem('nuradesk_offers', JSON.stringify(DEFAULT_OFFERS));
        }
      } else {
        setOffers(DEFAULT_OFFERS);
        localStorage.setItem('nuradesk_offers', JSON.stringify(DEFAULT_OFFERS));
      }

      // Load Categories from store catalog
      const savedCats = localStorage.getItem('nuradesk_categories');
      if (savedCats) {
        const parsedCats = JSON.parse(savedCats);
        if (Array.isArray(parsedCats)) {
          setAvailableCategories(parsedCats.map((c: any) => c.name || c));
        }
      } else {
        setAvailableCategories(['Burgers', 'Beverages', 'Coffee', 'Desserts', 'Snacks', 'Sides']);
      }

      // Load Products from store catalog
      const savedProds = localStorage.getItem('nuradesk_products');
      if (savedProds) {
        const parsedProds = JSON.parse(savedProds);
        if (Array.isArray(parsedProds)) {
          setAvailableProducts(
            parsedProds.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              price: Number(p.sellingPrice) || 0,
            }))
          );
        }
      }
    } catch (e) {
      setOffers(DEFAULT_OFFERS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync offers to localStorage whenever modified
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('nuradesk_offers', JSON.stringify(offers));
    } catch (e) {}
  }, [offers, isLoaded]);

  // Current date string (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const nextMonthStr = useMemo(
    () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    []
  );

  // KPI Calculations
  const activeOffersCount = useMemo(() => {
    return offers.filter((o) => o.isActive && o.startDate <= todayStr && o.endDate >= todayStr).length;
  }, [offers, todayStr]);

  const scheduledOffersCount = useMemo(() => {
    return offers.filter((o) => o.isActive && o.startDate > todayStr).length;
  }, [offers, todayStr]);

  const expiredOffersCount = useMemo(() => {
    return offers.filter((o) => !o.isActive || o.endDate < todayStr).length;
  }, [offers, todayStr]);

  const totalRedemptions = useMemo(() => {
    return offers.reduce((acc, o) => acc + (o.usageCount || 0), 0);
  }, [offers]);

  // Filtered offers list
  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // 1. Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = offer.title.toLowerCase().includes(q);
        const matchesDesc = offer.description?.toLowerCase().includes(q);
        const matchesCode = offer.code?.toLowerCase().includes(q);
        const matchesBadge = offer.badgeText?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCode && !matchesBadge) return false;
      }

      // 2. Status Tab
      if (statusTab === 'active') {
        if (!offer.isActive || offer.startDate > todayStr || offer.endDate < todayStr) return false;
      } else if (statusTab === 'scheduled') {
        if (!offer.isActive || offer.startDate <= todayStr) return false;
      } else if (statusTab === 'expired') {
        if (offer.isActive && offer.endDate >= todayStr) return false;
      }

      // 3. Discount Type Filter
      if (typeFilter !== 'all' && offer.discountType !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [offers, searchQuery, statusTab, typeFilter, todayStr]);

  // Helper to open create form (dedicated page)
  const handleOpenCreateForm = () => {
    setEditingOfferId(null);
    setFormTitle('');
    setFormCode('');
    setFormDescription('');
    setFormBadgeText('20% OFF');
    setFormDiscountType('percentage');
    setFormDiscountValue(20);
    setFormAppliesTo('all');
    setFormTargetCategories([]);
    setFormTargetProductIds([]);
    setFormMinSubtotal('');
    setFormMaxDiscount('');
    setFormStartDate(todayStr);
    setFormEndDate(nextMonthStr);
    setFormIsActive(true);
    setFormMaxUsageLimit('');
    setIsOfferFormOpen(true);
  };

  // Helper to open edit form (dedicated page)
  const handleOpenEditForm = (offer: StoreOffer) => {
    setEditingOfferId(offer.id);
    setFormTitle(offer.title);
    setFormCode(offer.code || '');
    setFormDescription(offer.description || '');
    setFormBadgeText(offer.badgeText || 'OFFER');
    setFormDiscountType(offer.discountType);
    setFormDiscountValue(offer.discountValue);
    setFormAppliesTo(offer.appliesTo);
    setFormTargetCategories(offer.targetCategories || []);
    setFormTargetProductIds(offer.targetProductIds || []);
    setFormMinSubtotal(offer.minSubtotal ? String(offer.minSubtotal) : '');
    setFormMaxDiscount(offer.maxDiscount ? String(offer.maxDiscount) : '');
    setFormStartDate(offer.startDate || todayStr);
    setFormEndDate(offer.endDate || nextMonthStr);
    setFormIsActive(offer.isActive);
    setFormMaxUsageLimit(offer.maxUsageLimit ? String(offer.maxUsageLimit) : '');
    setIsOfferFormOpen(true);
  };

  const handleCloseOfferForm = () => {
    setIsOfferFormOpen(false);
    setEditingOfferId(null);
  };

  // Save offer handler
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter an offer title');
      return;
    }
    if (!formDiscountValue || formDiscountValue <= 0) {
      alert('Please enter a valid discount value');
      return;
    }

    const newOfferData: StoreOffer = {
      id: editingOfferId || `offer-${Date.now()}`,
      title: formTitle.trim(),
      code: formCode.trim().toUpperCase() || undefined,
      description: formDescription.trim(),
      badgeText: formBadgeText.trim() || 'OFFER',
      discountType: formDiscountType,
      discountValue: Number(formDiscountValue),
      appliesTo: formAppliesTo,
      targetCategories: formAppliesTo === 'category' ? formTargetCategories : undefined,
      targetProductIds: formAppliesTo === 'products' ? formTargetProductIds : undefined,
      minSubtotal: formMinSubtotal ? Number(formMinSubtotal) : undefined,
      maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : undefined,
      startDate: formStartDate,
      endDate: formEndDate,
      isActive: formIsActive,
      usageCount: editingOfferId ? (offers.find((o) => o.id === editingOfferId)?.usageCount || 0) : 0,
      maxUsageLimit: formMaxUsageLimit ? Number(formMaxUsageLimit) : undefined,
      createdAt: editingOfferId
        ? (offers.find((o) => o.id === editingOfferId)?.createdAt || new Date().toISOString())
        : new Date().toISOString(),
    };

    if (editingOfferId) {
      setOffers((prev) => prev.map((o) => (o.id === editingOfferId ? newOfferData : o)));
    } else {
      setOffers((prev) => [newOfferData, ...prev]);
    }

    setIsOfferFormOpen(false);
    setEditingOfferId(null);
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
  };

  // Delete offer
  const handleDeleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // Duplicate offer
  const handleDuplicateOffer = (offer: StoreOffer) => {
    const duplicated: StoreOffer = {
      ...offer,
      id: `offer-${Date.now()}`,
      title: `${offer.title} (Copy)`,
      code: offer.code ? `${offer.code}_COPY` : undefined,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => [duplicated, ...prev]);
  };

  // Helper to format discount label
  const formatDiscountLabel = (offer: StoreOffer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    }
    if (offer.discountType === 'fixed_amount') {
      return `₹${offer.discountValue} OFF`;
    }
    return `Special ₹${offer.discountValue}`;
  };

  // Helper for status badge
  const getOfferStatusBadge = (offer: StoreOffer) => {
    if (!offer.isActive) {
      return { label: 'Paused', bg: '#F1F5F9', color: '#64748B', border: '#CBD5E1' };
    }
    if (offer.startDate > todayStr) {
      return { label: 'Scheduled', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
    }
    if (offer.endDate < todayStr) {
      return { label: 'Expired', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
    }
    return { label: 'Active in POS', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' };
  };

  // =========================================================================
  // VIEW 1: DEDICATED FULL-PAGE CREATE / EDIT VIEW (Like New Product Page)
  // =========================================================================
  if (isOfferFormOpen) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: theme.bgPage,
          color: theme.textPrimary,
        }}
      >
        <form onSubmit={handleSaveOffer} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Top Sticky Header Bar */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 40,
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              borderBottom: `1px solid ${theme.border}`,
              padding: '0.85rem clamp(1rem, 2.5vw, 2rem)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={handleCloseOfferForm}
                  title="Back to Offers"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                    color: theme.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                    e.currentTarget.style.color = theme.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.sidebarIsDark ? theme.bgCard : '#FFFFFF';
                    e.currentTarget.style.color = theme.textSecondary;
                  }}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 20 }} />
                </button>

                <div>
                  <h1
                    style={{
                      fontSize: '19px',
                      fontWeight: 800,
                      letterSpacing: '-0.025em',
                      color: theme.textPrimary,
                      margin: '0 0 2px 0',
                    }}
                  >
                    {editingOfferId ? 'Edit Offer & Promotion' : 'Create New Offer'}
                  </h1>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: theme.textSecondary,
                      margin: 0,
                    }}
                  >
                    Configure promotional rules, discount values, applicability, and validity dates.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  className="button-20-secondary"
                  onClick={handleCloseOfferForm}
                  style={{
                    height: '38px',
                    padding: '0 1.25rem',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    fontFamily: 'inherit',
                  }}
                >
                  Discard
                </button>

                <button
                  type="submit"
                  className="button-20"
                  style={{
                    height: '38px',
                    padding: '0 1.5rem',
                    borderRadius: '9999px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    fontFamily: 'inherit',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <CheckRoundedIcon sx={{ fontSize: 18 }} />
                  <span>{editingOfferId ? 'Save Changes' : 'Publish Offer'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Content Body - Clean Cards like Product Page */}
          <div
            style={{
              maxWidth: '1000px',
              width: '100%',
              margin: '0 auto',
              padding: '1.75rem clamp(1rem, 2.5vw, 2rem) 3.5rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Card 1: Offer Information */}
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${theme.borderCard || theme.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 0.25rem 0', color: theme.textPrimary }}>
                Offer Information
              </h3>
              <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0' }}>
                Basic identification details, customer-facing badge, and optional checkout coupon code.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Offer Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Weekend Mega Deal, Happy Hour"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Coupon Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SAVE20, COMBO50"
                      value={formCode}
                      onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                      style={{
                        ...fieldInputStyle,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    />
                    <span style={{ fontSize: '10.5px', color: theme.textSecondary, marginTop: '2px', display: 'block' }}>
                      Leave blank for automatic discount on matching items
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20% off all beverages this weekend"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      POS Badge Pill
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20% OFF, SPECIAL"
                      value={formBadgeText}
                      onChange={(e) => setFormBadgeText(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Discount & Pricing */}
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${theme.borderCard || theme.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 0.25rem 0', color: theme.textPrimary }}>
                Discount & Pricing Rules
              </h3>
              <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0' }}>
                Determine how the reduction is calculated and set minimum spend thresholds.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.5rem' }}>
                    Discount Mechanics *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {[
                      { id: 'percentage', label: 'Percentage (%)', desc: 'e.g. 15% off regular price' },
                      { id: 'fixed_amount', label: 'Flat Amount (₹)', desc: 'e.g. ₹50 deduction' },
                      { id: 'promo_price', label: 'Special Price (₹)', desc: 'e.g. Fixed ₹99 special' },
                    ].map((t) => {
                      const isSelected = formDiscountType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormDiscountType(t.id as any)}
                          className={isSelected ? 'button-20' : 'button-20-secondary'}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 800 }}>{t.label}</span>
                          <span style={{ fontSize: '11px', opacity: isSelected ? 0.85 : 0.65 }}>{t.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      {formDiscountType === 'percentage'
                        ? 'Discount Percentage (%) *'
                        : formDiscountType === 'fixed_amount'
                        ? 'Flat Deduction Amount (₹) *'
                        : 'Promotional Target Price (₹) *'}
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      required
                      value={formDiscountValue}
                      onChange={(e) => setFormDiscountValue(parseFloat(e.target.value) || 0)}
                      style={{
                        ...fieldInputStyle,
                        fontSize: '13.5px',
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                      Minimum Order Spend (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Optional, e.g. 200"
                      value={formMinSubtotal}
                      onChange={(e) => setFormMinSubtotal(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Scope & Applicability */}
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${theme.borderCard || theme.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 0.25rem 0', color: theme.textPrimary }}>
                Target Products & Scope
              </h3>
              <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0' }}>
                Control which products in your catalog trigger or qualify for this discount.
              </p>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'all', label: 'All Catalog Products' },
                    { id: 'category', label: 'Specific Category' },
                    { id: 'products', label: 'Specific Products' },
                  ].map((scope) => (
                    <label
                      key={scope.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: theme.textPrimary,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="appliesTo"
                        checked={formAppliesTo === scope.id}
                        onChange={() => setFormAppliesTo(scope.id as any)}
                      />
                      <span>{scope.label}</span>
                    </label>
                  ))}
                </div>

                {/* Category Selector */}
                {formAppliesTo === 'category' && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.45rem' }}>
                      Select Target Categories:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {availableCategories.length === 0 ? (
                        <span style={{ fontSize: '12px', color: theme.textSecondary }}>No categories found in store.</span>
                      ) : (
                        availableCategories.map((cat) => {
                          const isCatSelected = formTargetCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setFormTargetCategories((prev) =>
                                  isCatSelected ? prev.filter((c) => c !== cat) : [...prev, cat]
                                );
                              }}
                              className={isCatSelected ? 'button-20' : 'button-20-secondary'}
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* Product Multi-selector */}
                {formAppliesTo === 'products' && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.45rem' }}>
                      Select Participating Products:
                    </label>
                    <div
                      style={{
                        maxHeight: '160px',
                        overflowY: 'auto',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '0.6rem',
                        padding: '0.65rem',
                        backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.45rem',
                      }}
                    >
                      {availableProducts.length === 0 ? (
                        <div style={{ fontSize: '12px', color: theme.textSecondary, padding: '0.5rem' }}>
                          No products available in catalog.
                        </div>
                      ) : (
                        availableProducts.map((p) => {
                          const isChecked = formTargetProductIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                backgroundColor: isChecked ? (theme.sidebarIsDark ? theme.hoverBg : '#F8FAFC') : 'transparent',
                                fontSize: '12.5px',
                                cursor: 'pointer',
                                color: theme.textPrimary,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  setFormTargetProductIds((prev) =>
                                    isChecked ? prev.filter((id) => id !== p.id) : [...prev, p.id]
                                  );
                                }}
                              />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.name} (₹{p.price})
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Schedule & Validity */}
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${theme.borderCard || theme.border}`,
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 0.25rem 0', color: theme.textPrimary }}>
                Schedule & Validity Period
              </h3>
              <p style={{ fontSize: '12.5px', color: theme.textSecondary, margin: '0 0 1.25rem 0' }}>
                Set the active date window. Promotions activate and deactivate automatically in POS.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    style={fieldInputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.textSecondary, marginBottom: '0.35rem' }}>
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                />
                <label htmlFor="isActiveToggle" style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary, cursor: 'pointer' }}>
                  Enable this offer immediately in POS
                </label>
              </div>
            </div>

            {/* Card 5: Real-time POS Preview */}
            <div
              style={{
                backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
                border: `1px solid ${theme.borderCard || theme.border}`,
                borderRadius: '1rem',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <AutoAwesomeRoundedIcon sx={{ fontSize: 24, color: '#D97706' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: theme.textPrimary }}>
                    POS Visual Preview: {formTitle || 'Sample Offer'}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '2px' }}>
                    Badge: <strong>[{formBadgeText || 'OFFER'}]</strong> • Discount: {formDiscountValue}
                    {formDiscountType === 'percentage' ? '%' : ' ₹'}
                    {formCode ? ` • Coupon Code: "${formCode}"` : ' • Automatically applies in POS'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '11.5px',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
                }}
              >
                {formBadgeText || 'OFFER'}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: OFFERS LIST DASHBOARD
  // =========================================================================
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: theme.bgPage,
        padding: 'clamp(1rem, 2vw, 2rem)',
        boxSizing: 'border-box',
        color: theme.textPrimary,
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: theme.activeBg,
                color: theme.activeText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalOfferRoundedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  margin: 0,
                  color: theme.textPrimary,
                  letterSpacing: '-0.02em',
                }}
              >
                Offers & Promotions
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  margin: '2px 0 0 0',
                  color: theme.textSecondary,
                }}
              >
                Create automated discounts, category promotions, and checkout promo codes for your POS terminal.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="button-20"
            style={{
              borderRadius: '9999px',
              padding: '0.45rem 1.15rem',
              fontSize: '12.5px',
              fontWeight: 700,
              fontFamily: 'inherit',
            }}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
            <span>Create New Offer</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards - Simple, Clean Modern UI like Home */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          {
            label: 'Active in POS',
            value: `${activeOffersCount} Offers`,
            subtext: 'Live & applying automatically in terminal',
            badge: activeOffersCount > 0 ? 'Live Now' : 'Idle',
            badgeColor: activeOffersCount > 0 ? '#16A34A' : '#64748B',
            badgeBg: activeOffersCount > 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(100, 116, 139, 0.1)',
          },
          {
            label: 'Scheduled Deals',
            value: `${scheduledOffersCount} Upcoming`,
            subtext: 'Promotions starting on future dates',
            badge: 'Scheduled',
            badgeColor: '#2563EB',
            badgeBg: 'rgba(37, 99, 235, 0.1)',
          },
          {
            label: 'Total Redemptions',
            value: `${totalRedemptions} Orders`,
            subtext: 'Claims across completed checkouts',
            badge: 'Redeemed',
            badgeColor: '#D97706',
            badgeBg: 'rgba(217, 119, 6, 0.1)',
          },
          {
            label: 'Expired / Paused',
            value: `${expiredOffersCount}`,
            subtext: 'Past or currently disabled promotions',
            badge: 'Archived',
            badgeColor: '#6B7280',
            badgeBg: 'rgba(107, 114, 128, 0.1)',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              border: `1px solid ${theme.borderCard || theme.border}`,
              borderRadius: '0.9rem',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '115px',
              boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: theme.textSecondary }}>
                {stat.label}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: stat.badgeColor,
                  backgroundColor: stat.badgeBg,
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {stat.badge}
              </span>
            </div>
            <div style={{ marginTop: '0.65rem' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: theme.textPrimary,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: theme.textSecondary, marginTop: '4px', fontWeight: 450 }}>
                {stat.subtext}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.85rem',
          marginBottom: '1.25rem',
          backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
          padding: '0.75rem 1rem',
          borderRadius: '0.9rem',
          border: `1px solid ${theme.borderCard || theme.border}`,
        }}
      >
        {/* Status Tabs with button-20 styling */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', overflowX: 'auto' }}>
          {[
            { id: 'all', label: `All (${offers.length})` },
            { id: 'active', label: `Active (${activeOffersCount})` },
            { id: 'scheduled', label: `Scheduled (${scheduledOffersCount})` },
            { id: 'expired', label: `Expired (${expiredOffersCount})` },
          ].map((tab) => {
            const isSelected = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id as any)}
                className={isSelected ? 'button-20' : 'button-20-secondary'}
                style={{
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search input & Type filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              padding: '0.4rem 0.85rem',
              borderRadius: '0.6rem',
              border: `1px solid ${theme.border}`,
              minWidth: '220px',
            }}
          >
            <SearchRoundedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
            <input
              type="text"
              placeholder="Search offer or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '12.5px',
                color: theme.textPrimary,
                fontFamily: 'inherit',
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.textSecondary, display: 'flex' }}
              >
                <CloseRoundedIcon sx={{ fontSize: 15 }} />
              </button>
            )}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.6rem',
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.sidebarIsDark ? theme.bgCard : '#FFFFFF',
              color: theme.textPrimary,
              fontSize: '12.5px',
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="all">All Discount Types</option>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed_amount">Fixed Amount (₹)</option>
            <option value="promo_price">Special Promo Price</option>
          </select>
        </div>
      </div>

      {/* Offers Table View */}
      <div
        style={{
          backgroundColor: theme.bgCard,
          border: `1px solid ${theme.border}`,
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: theme.tableHeaderBg,
                  borderBottom: `1px solid ${theme.border}`,
                  color: theme.textSecondary,
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ padding: '0.85rem 1.15rem' }}>Offer & Badge</th>
                <th style={{ padding: '0.85rem 1.15rem' }}>Discount</th>
                <th style={{ padding: '0.85rem 1.15rem' }}>Scope (Applies To)</th>
                <th style={{ padding: '0.85rem 1.15rem' }}>Promo Code</th>
                <th style={{ padding: '0.85rem 1.15rem' }}>Validity</th>
                <th style={{ padding: '0.85rem 1.15rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                      <LocalOfferRoundedIcon sx={{ fontSize: 44, color: theme.textMuted, opacity: 0.4 }} />
                      <div style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary }}>
                        No offers found
                      </div>
                      <div style={{ fontSize: '12.5px', color: theme.textSecondary, maxWidth: '340px' }}>
                        {searchQuery
                          ? 'No promotions match your search criteria. Try a different keyword.'
                          : 'You haven’t created any promotions yet. Create your first promotional deal to offer discounts at POS.'}
                      </div>
                      {!searchQuery && (
                        <button
                          type="button"
                          onClick={handleOpenCreateForm}
                          className="button-20"
                          style={{
                            marginTop: '0.65rem',
                            borderRadius: '9999px',
                            padding: '0.45rem 1.15rem',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: 'inherit',
                          }}
                        >
                          + Create First Offer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const status = getOfferStatusBadge(offer);
                  return (
                    <tr
                      key={offer.id}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.tableRowHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Offer & Badge */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              border: '1px solid #FDE68A',
                              fontSize: '11px',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {offer.badgeText || 'OFFER'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: theme.textPrimary }}>{offer.title}</div>
                            {offer.description && (
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  color: theme.textSecondary,
                                  maxWidth: '260px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {offer.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '13px',
                            color: '#059669',
                            backgroundColor: '#ECFDF5',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {formatDiscountLabel(offer)}
                        </span>
                        {offer.minSubtotal && (
                          <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '3px' }}>
                            Min spend ₹{offer.minSubtotal}
                          </div>
                        )}
                      </td>

                      {/* Scope */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        <span style={{ fontWeight: 600, color: theme.textPrimary }}>
                          {offer.appliesTo === 'all'
                            ? 'All Products'
                            : offer.appliesTo === 'category'
                            ? `${offer.targetCategories?.length || 0} Categories`
                            : `${offer.targetProductIds?.length || 0} Products`}
                        </span>
                        {offer.appliesTo === 'category' && offer.targetCategories && (
                          <div style={{ fontSize: '11px', color: theme.textSecondary, marginTop: '2px' }}>
                            {offer.targetCategories.slice(0, 2).join(', ')}
                            {offer.targetCategories.length > 2 && ' +more'}
                          </div>
                        )}
                      </td>

                      {/* Coupon Code */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        {offer.code ? (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: '11.5px',
                              padding: '2px 7px',
                              borderRadius: '5px',
                              backgroundColor: theme.hoverBg,
                              color: theme.textPrimary,
                              border: `1px solid ${theme.border}`,
                              letterSpacing: '0.04em',
                            }}
                          >
                            {offer.code}
                          </span>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: theme.textSecondary, fontStyle: 'italic' }}>
                            Auto-applied
                          </span>
                        )}
                      </td>

                      {/* Validity */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                          {offer.startDate}
                        </div>
                        <div style={{ fontSize: '11px', color: theme.textSecondary }}>
                          to {offer.endDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.95rem 1.15rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(offer.id)}
                          title="Click to toggle status"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: 800,
                            backgroundColor: status.bg,
                            color: status.color,
                            border: `1px solid ${status.border}`,
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: status.color,
                            }}
                          />
                          {status.label}
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td style={{ padding: '0.95rem 1.15rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(offer)}
                            title="Edit Offer"
                            style={{
                              padding: '5px',
                              borderRadius: '7px',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.hoverBg,
                              color: theme.textPrimary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <EditRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateOffer(offer)}
                            title="Duplicate Offer"
                            style={{
                              padding: '5px',
                              borderRadius: '7px',
                              border: `1px solid ${theme.border}`,
                              backgroundColor: theme.hoverBg,
                              color: theme.textPrimary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOffer(offer.id)}
                            title="Delete Offer"
                            style={{
                              padding: '5px',
                              borderRadius: '7px',
                              border: '1px solid #FCA5A5',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
