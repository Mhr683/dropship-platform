import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Globe,
  Phone,
  Mail,
  MapPin,
  Landmark,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Tag,
  CreditCard,
  User,
  Fingerprint
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PAKISTAN_BANKS } from '../data/mockData';
import { PRODUCT_CATEGORIES } from './RegisterModal';

// Preset Pakistani Store / Brand Logos
const PRESET_LOGOS = [
  {
    name: 'Apex Modern E-Com',
    url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    category: 'Reseller & Tech'
  },
  {
    name: 'Oshi Wholesale Logistics',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
    category: 'Wholesale & Warehousing'
  },
  {
    name: 'Urban Trends Boutique',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    category: 'Fashion & Apparel'
  },
  {
    name: 'TechMatrix Gadgets',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    category: 'Electronics & Gadgets'
  },
  {
    name: 'GreenLeaf Organic & Health',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    category: 'Personal Care'
  },
  {
    name: 'HomeCrafters PK',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80',
    category: 'Home & Kitchen'
  }
];

export const ProfileSettingsModal: React.FC = () => {
  const {
    isProfileSettingsOpen,
    setIsProfileSettingsOpen,
    currentUser,
    updateUserProfile,
    activeRole
  } = useApp();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'business' | 'banking' | 'tax'>('profile');

  // Form State initialized from currentUser
  const [logo, setLogo] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState<string>('');
  const [cnicNumber, setCnicNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('INDIVIDUAL');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('Karachi');
  const [province, setProvince] = useState<string>('Sindh');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [storeUrl, setStoreUrl] = useState<string>('');
  const [ntnNumber, setNtnNumber] = useState<string>('');
  const [strnNumber, setStrnNumber] = useState<string>('');
  const [bankName, setBankName] = useState<string>(PAKISTAN_BANKS[0]);
  const [accountTitle, setAccountTitle] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [customLogoUrlInput, setCustomLogoUrlInput] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Sync state whenever currentUser changes or modal opens
  useEffect(() => {
    if (currentUser && isProfileSettingsOpen) {
      setLogo(currentUser.logo || PRESET_LOGOS[0].url);
      setName(currentUser.name || '');
      setFatherOrHusbandName(currentUser.fatherOrHusbandName || '');
      setCnicNumber(currentUser.cnicNumber || '35202-9847291-5');
      setCompanyName(currentUser.companyName || '');
      setBusinessType(currentUser.businessType || (currentUser.role === 'SUPPLIER' ? 'SOLE_PROP' : 'INDIVIDUAL'));
      setPhone(currentUser.phone || '');
      setEmail(currentUser.email || '');
      setCity(currentUser.city || 'Karachi');
      setProvince(currentUser.province || 'Sindh');
      setFullAddress(currentUser.fullAddress || '');
      setPostalCode(currentUser.postalCode || '75400');
      setStoreUrl(currentUser.storeUrl || '');
      setNtnNumber(currentUser.ntnNumber || '');
      setStrnNumber(currentUser.strnNumber || '');
      setBankName(currentUser.payoutDetails?.bankName || PAKISTAN_BANKS[0]);
      setAccountTitle(currentUser.payoutDetails?.accountTitle || currentUser.name.toUpperCase());
      setAccountNumber(currentUser.payoutDetails?.accountNumber || currentUser.payoutDetails?.iban || '');
      setSelectedCategories(currentUser.categories || [PRODUCT_CATEGORIES[0], PRODUCT_CATEGORIES[1]]);
      setErrorMessage('');
      setIsSavedSuccess(false);
    }
  }, [currentUser, isProfileSettingsOpen]);

  if (!isProfileSettingsOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogo(reader.result);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate Legal Name according to CNIC
  const validateLegalName = (inputName: string): boolean => {
    const trimmed = inputName.trim();
    if (!trimmed || trimmed.length < 3) return false;
    // Must contain letters, spaces, hyphens, dots only (no numbers or special characters)
    const validCharsRegex = /^[a-zA-Z\s.-]+$/;
    if (!validCharsRegex.test(trimmed)) return false;
    // Must be at least 2 words (e.g. First name and Last name)
    const words = trimmed.split(/\s+/).filter(Boolean);
    return words.length >= 2;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // CNIC Legal Name validation
    if (!validateLegalName(name)) {
      setErrorMessage('نام شناختی کارڈ (CNIC) کے عین مطابق کم از کم 2 الفاظ پر مشتمل ہونا چاہیے (مثال: Muhammad Tariq Ali) بغیر نمبر یا غیر متعلقہ علامات کے۔');
      setActiveSettingsTab('profile');
      return;
    }

    if (!companyName.trim()) {
      setErrorMessage('Store / Business name cannot be empty.');
      setActiveSettingsTab('business');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Valid mobile number is required for OTP notifications.');
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMessage('Bank IBAN or account number is required for settlements.');
      setActiveSettingsTab('banking');
      return;
    }

    // Apply updates
    updateUserProfile({
      logo: logo || PRESET_LOGOS[0].url,
      avatar: logo || PRESET_LOGOS[0].url,
      name: name.trim(),
      fatherOrHusbandName: fatherOrHusbandName.trim(),
      companyName: companyName.trim(),
      businessType,
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      province,
      fullAddress: fullAddress.trim(),
      postalCode: postalCode.trim(),
      storeUrl: storeUrl.trim(),
      categories: selectedCategories,
      ntnNumber: ntnNumber.trim(),
      strnNumber: strnNumber.trim(),
      payoutDetails: {
        bankName,
        accountTitle: accountTitle.trim().toUpperCase() || name.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        iban: accountNumber.trim().startsWith('PK') ? accountNumber.trim() : undefined
      }
    });

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      setIsProfileSettingsOpen(false);
    }, 1200);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl space-y-6 max-h-[94vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={logo || PRESET_LOGOS[0].url}
                alt="Store Logo"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border-2 border-slate-900">
                <CheckCircle2 className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-white text-lg sm:text-xl tracking-tight">
                  {companyName || 'Partner Profile Settings'}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {currentUser.role === 'SUPPLIER' ? 'Wholesale Vendor' : currentUser.role === 'RESELLER' ? 'Verified Reseller' : 'Admin Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage your store brand logo, verified CNIC details, bank settlements, and contact profile.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileSettingsOpen(false)}
            className="self-end sm:self-auto p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 gap-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSettingsTab('profile')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSettingsTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Store Logo & Identity (CNIC)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSettingsTab('business')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSettingsTab === 'business'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store & Channels</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSettingsTab('banking')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSettingsTab === 'banking'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>1Link / Raast Settlement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSettingsTab('tax')}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeSettingsTab === 'tax'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Address & Tax (NTN)</span>
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3.5 text-xs text-red-200 flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {isSavedSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-bold">Profile & Logo updated successfully! Profile changes are now live.</span>
          </div>
        )}

        {/* Form Details */}
        <form onSubmit={handleSave} className="space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: LOGO & CNIC IDENTITY */}
          {/* ======================================================== */}
          {activeSettingsTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Store Logo Section */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-400" /> Store & Brand Logo
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Your logo appears on the Header, Sidebar, Reseller/Supplier pages, and packing invoices.
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    High Resolution (Square 1:1)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Current Active Logo Preview */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative group">
                      <img
                        src={logo || PRESET_LOGOS[0].url}
                        alt="Current Logo"
                        className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl bg-slate-900"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white">
                        Active Logo
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Live Preview</span>
                  </div>

                  {/* Upload Custom File & URL */}
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="font-bold text-slate-300 text-xs mb-1.5 block">
                        Upload Logo Image from Computer / Phone:
                      </label>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold cursor-pointer transition">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Choose Image (PNG, JPG, WEBP - Max 2MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="font-bold text-slate-300 text-xs mb-1 block">Or Paste Direct Image Web URL:</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={customLogoUrlInput}
                          onChange={(e) => setCustomLogoUrlInput(e.target.value)}
                          placeholder="https://example.com/my-logo.png"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customLogoUrlInput.trim()) {
                              setLogo(customLogoUrlInput.trim());
                              setCustomLogoUrlInput('');
                            }
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition"
                        >
                          Apply URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preset Brand Badges Selector */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="text-[11px] font-bold text-slate-300 mb-2 block">
                    Or choose from curated professional brand templates:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PRESET_LOGOS.map((preset, idx) => {
                      const isSelected = logo === preset.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setLogo(preset.url)}
                          className={`p-2 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-white truncate">{preset.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">{preset.category}</p>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* NADRA CNIC Identity Section (Strict Legal Name Acceptance) */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-400" /> NADRA CNIC Legal Identity
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> SBP Verified Identity
                  </span>
                </div>

                {/* Urdu/English Policy Notice */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> CNIC Legal Name Security Policy (شناختی کارڈ کی تصدیق)
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    قوانین کے مطابق آپ کا اکاؤنٹ نام لازمی طور پر آپ کے شناختی کارڈ (CNIC) پر درج شدہ نام کے عین مطابق ہونا چاہیے، تاکہ تمام 1Link / Raast کیش آن ڈیلیوری (COD) پے آؤٹس اور بینک اکاؤنٹ ٹائٹل کامیابی سے تصدیق ہو سکیں۔
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Full Legal Name */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Full Legal Name (Strictly as per CNIC)</span>
                      <span className="text-[10px] text-emerald-400 font-bold">NADRA Match</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Tariq Ali"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Must contain at least First & Last name (e.g. Mahr Mohsin Ali).
                    </p>
                  </div>

                  {/* Father or Husband Name */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1.5 block">
                      Father / Husband Name
                    </label>
                    <input
                      type="text"
                      value={fatherOrHusbandName}
                      onChange={(e) => setFatherOrHusbandName(e.target.value)}
                      placeholder="Father / Husband Name"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* CNIC Number */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>13-Digit NADRA CNIC Number</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
                    </label>
                    <input
                      type="text"
                      value={cnicNumber}
                      onChange={(e) => setCnicNumber(e.target.value)}
                      placeholder="00000-0000000-0"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Partner Referral Code */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1.5 block">
                      Account Referral Code
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={currentUser.referralCode || 'YM-PRO-PARTNER'}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2.5 text-emerald-400 font-mono font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STORE & CHANNELS */}
          {/* ======================================================== */}
          {activeSettingsTab === 'business' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Store / Business Brand Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex E-Com Traders"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Business Legal Structure</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="INDIVIDUAL">Individual Freelancer / Sole Dropshipper</option>
                    <option value="SOLE_PROP">Sole Proprietorship (Registered)</option>
                    <option value="PVT_LTD">Private Limited Company (SECP)</option>
                    <option value="PARTNERSHIP">Registered Partnership / AOP</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 mb-1.5 block">Store Website / Shopify / Daraz URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="url"
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      placeholder="https://yourbrand.myshopify.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Product Categories */}
              <div className="space-y-2 pt-2">
                <label className="font-bold text-slate-300 text-xs block">Operating Product Niches:</label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: 1LINK / RAAST BANKING & SETTLEMENT */}
          {/* ======================================================== */}
          {activeSettingsTab === 'banking' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-emerald-400 text-sm">Automated T+1 COD Payout Settlement</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Profits are automatically dispatched via 1Link & Raast Instant Pay matching your CNIC name.
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-emerald-400 shrink-0 opacity-80" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Settlement Bank</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    {PAKISTAN_BANKS.map((b, idx) => (
                      <option key={idx} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Account Title</span>
                    <span className="text-[10px] text-emerald-400 font-bold">Must Match CNIC</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value.toUpperCase())}
                    placeholder={name.toUpperCase() || 'MAHR MOHSIN ALI'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>24-Character IBAN / Account / Raast Number</span>
                    <span className="text-[10px] text-slate-400 font-mono">e.g. PK92MEZN0001000849201901</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="PK..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ADDRESS & TAX (NTN) */}
          {/* ======================================================== */}
          {activeSettingsTab === 'tax' && (
            <div className="space-y-5 animate-fadeIn text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Mobile Phone (OTP Verified)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Business Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Province</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Islamabad">Islamabad Capital Territory</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Karachi, Rawalpindi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 mb-1.5 block">Complete Physical Dispatch / Office Address</label>
                  <textarea
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Plaza / Street / Area / City"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>FBR NTN Number (Optional / اختیاری)</span>
                    <span className="text-[10px] text-slate-500">Not Mandatory</span>
                  </label>
                  <input
                    type="text"
                    value={ntnNumber}
                    onChange={(e) => setNtnNumber(e.target.value)}
                    placeholder="Leave blank if none (e.g. 7392018-4)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>STRN Sales Tax Number (Optional)</span>
                    <span className="text-[10px] text-slate-500">Suppliers Only</span>
                  </label>
                  <input
                    type="text"
                    value={strnNumber}
                    onChange={(e) => setStrnNumber(e.target.value)}
                    placeholder="Leave blank if not registered"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>All changes are encrypted and synchronized instantly.</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsProfileSettingsOpen(false)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
