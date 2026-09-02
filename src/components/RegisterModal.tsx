import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Building2,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Phone,
  Mail,
  Lock,
  FileText,
  Upload,
  CreditCard,
  MapPin,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Fingerprint,
  QrCode,
  Store,
  Warehouse,
  FileSpreadsheet,
  Globe,
  RefreshCw,
  Award,
  ExternalLink,
  Smartphone,
  Send,
  CheckCheck,
  Clock,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Gujranwala', 'Sialkot', 'Quetta',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Gujrat',
  'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Mardan', 'Kasur'
];

export const PAKISTAN_BANKS = [
  'Meezan Bank Limited',
  'Habib Bank Limited (HBL)',
  'United Bank Limited (UBL)',
  'MCB Bank Limited',
  'Bank Alfalah Limited',
  'Allied Bank Limited (ABL)',
  'Faysal Bank',
  'Standard Chartered Bank Pakistan',
  'BankIslami Pakistan',
  'Dubai Islamic Bank',
  'Askari Bank Limited',
  'JS Bank Limited',
  'Soneri Bank',
  'SadaPay (Mastercard / EMI)',
  'NayaPay (Visa / EMI)',
  'JazzCash Merchant Account',
  'Easypaisa Merchant Account'
];

export const SALES_CHANNELS = [
  { id: 'daraz', name: 'Daraz.pk Seller Store', icon: '🛒' },
  { id: 'shopify', name: 'Custom Shopify / WooCommerce Store', icon: '🛍️' },
  { id: 'tiktok', name: 'TikTok Shop / Social Commerce', icon: '📱' },
  { id: 'whatsapp', name: 'WhatsApp Catalog & Direct Broadcasts', icon: '💬' },
  { id: 'facebook', name: 'Facebook & Instagram Marketplace', icon: '📸' }
];

export const PRODUCT_CATEGORIES = [
  'Consumer Electronics & Mobile Gadgets',
  'Fashion & Apparel',
  'Watches, Jewelry & Accessories',
  'Health, Beauty & Skincare',
  'Home, Kitchen & Living',
  'Motors, Automotive & Tools',
  'Sports & Outdoor Goods',
  'Baby Products & Toys'
];

export const PRESET_REGISTRATION_LOGOS = [
  {
    name: 'Apex Modern E-Com',
    url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200&auto=format&fit=crop&q=80',
    type: 'Dropship & Retail'
  },
  {
    name: 'Oshi Wholesale Hub',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
    type: 'Wholesale & B2B'
  },
  {
    name: 'Urban Trends Boutique',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    type: 'Apparel & Lifestyle'
  },
  {
    name: 'TechMatrix PK',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    type: 'Smart Gadgets'
  },
  {
    name: 'GreenLeaf Naturals',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    type: 'Health & Beauty'
  },
  {
    name: 'HomeCrafters Direct',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80',
    type: 'Home & Kitchen'
  }
];

export const RegisterModal: React.FC = () => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, setActiveRole, registerUser } = useApp();

  // Current Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepValidationError, setStepValidationError] = useState<string>('');

  // Step 1: Role & Business Details + Store Logo
  const [role, setRole] = useState<'RESELLER' | 'SUPPLIER'>('RESELLER');
  const [businessType, setBusinessType] = useState<'INDIVIDUAL' | 'SOLE_PROP' | 'PVT_LTD' | 'PARTNERSHIP'>('INDIVIDUAL');
  const [businessName, setBusinessName] = useState('Apex Ecom Ventures');
  const [storeLogo, setStoreLogo] = useState<string>(PRESET_REGISTRATION_LOGOS[0].url);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [ntnNumber, setNtnNumber] = useState('');
  const [salesChannels, setSalesChannels] = useState<string[]>(['daraz', 'shopify']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([PRODUCT_CATEGORIES[0], PRODUCT_CATEGORIES[3]]);
  const [storeWebsiteUrl, setStoreWebsiteUrl] = useState('https://apex-store.myshopify.com');

  // Step 2: NADRA CNIC & Identity Verification
  const [fullName, setFullName] = useState('Muhammad Hammad Ali');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('Tariq Mehmood');
  const [cnicNumber, setCnicNumber] = useState('42101-8392019-3');
  const [dob, setDob] = useState('1994-08-14');
  const [cnicFrontUploaded, setCnicFrontUploaded] = useState<boolean>(true);
  const [cnicBackUploaded, setCnicBackUploaded] = useState<boolean>(true);
  const [isCnicVerified, setIsCnicVerified] = useState<boolean>(true);

  // Step 3: Contact & Real 4-Digit OTP Verification
  const [phone, setPhone] = useState('03008472910');
  const [generatedPhoneOtp, setGeneratedPhoneOtp] = useState<string>('');
  const [enteredPhoneOtp, setEnteredPhoneOtp] = useState<string>('');
  const [isPhoneOtpSent, setIsPhoneOtpSent] = useState<boolean>(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [phoneOtpError, setPhoneOtpError] = useState<string>('');
  const [phoneCountdown, setPhoneCountdown] = useState<number>(0);
  const [simulatedSmsToast, setSimulatedSmsToast] = useState<string | null>(null);

  const [email, setEmail] = useState('hammad.ecom@gmail.com');
  const [generatedEmailOtp, setGeneratedEmailOtp] = useState<string>('');
  const [enteredEmailOtp, setEnteredEmailOtp] = useState<string>('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [emailOtpError, setEmailOtpError] = useState<string>('');
  const [emailCountdown, setEmailCountdown] = useState<number>(0);
  const [simulatedEmailToast, setSimulatedEmailToast] = useState<string | null>(null);

  // Address & Province
  const [province, setProvince] = useState<'Punjab' | 'Sindh' | 'KPK' | 'Balochistan' | 'Islamabad'>('Sindh');
  const [city, setCity] = useState<string>('Karachi');
  const [fullAddress, setFullAddress] = useState<string>('Suite 402, Business Avenue, Shahrah-e-Faisal, Block 6 PECHS');
  const [postalCode, setPostalCode] = useState<string>('75400');

  // Step 4: 1Link / Raast Settlement Banking
  const [payoutMethod, setPayoutMethod] = useState<'IBAN' | 'RAAST' | 'WALLET'>('IBAN');
  const [bankName, setBankName] = useState<string>(PAKISTAN_BANKS[0]);
  const [accountTitle, setAccountTitle] = useState<string>('MUHAMMAD HAMMAD ALI');
  const [ibanOrAccountNumber, setIbanOrAccountNumber] = useState<string>('PK92MEZN0001000849201901');
  const [is1LinkVerified, setIs1LinkVerified] = useState<boolean>(true);
  const [isFetching1Link, setIsFetching1Link] = useState<boolean>(false);

  // Step 5: Capacity & Supplier/Reseller Specifics
  const [warehouseCapacitySqFt, setWarehouseCapacitySqFt] = useState<number>(3500);
  const [dailyDispatchCapacity, setDailyDispatchCapacity] = useState<number>(300);
  const [returnSlaHours, setReturnSlaHours] = useState<number>(24);
  const [expectedMonthlyOrders, setExpectedMonthlyOrders] = useState<string>('200-500 orders/month');
  const [strnSalesTaxNumber, setStrnSalesTaxNumber] = useState<string>('');

  // Agreements
  const [agreeCodPolicy, setAgreeCodPolicy] = useState<boolean>(true);
  const [agreeAntiCounterfeit, setAgreeAntiCounterfeit] = useState<boolean>(true);
  const [agreeTermsAndTax, setAgreeTermsAndTax] = useState<boolean>(true);

  // Submission & Success state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [generatedPartnerId, setGeneratedPartnerId] = useState<string>('');

  // Countdown timers for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phoneCountdown > 0) {
      timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phoneCountdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emailCountdown > 0) {
      timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [emailCountdown]);

  if (!isRegisterModalOpen) return null;

  // Format CNIC as user types: 00000-0000000-0
  const handleCnicChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 5 && raw.length <= 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;
    } else if (raw.length > 12) {
      formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12, 13)}`;
    }
    setCnicNumber(formatted);
    if (raw.length === 13) {
      setIsCnicVerified(true);
    } else {
      setIsCnicVerified(false);
    }
  };

  // Toggle Sales Channels
  const toggleChannel = (channelId: string) => {
    if (salesChannels.includes(channelId)) {
      setSalesChannels(salesChannels.filter(c => c !== channelId));
    } else {
      setSalesChannels([...salesChannels, channelId]);
    }
  };

  // Toggle Categories
  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // SEND 4-DIGIT PHONE OTP
  const handleSendPhoneOtp = () => {
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setPhoneOtpError('Please enter a valid 11-digit Pakistani mobile number (e.g. 03001234567)');
      return;
    }

    // Generate random 4-digit code (e.g., 6842)
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedPhoneOtp(newOtp);
    setIsPhoneOtpSent(true);
    setIsPhoneVerified(false);
    setPhoneOtpError('');
    setPhoneCountdown(60);
    setEnteredPhoneOtp('');

    // Show simulated live SMS alert
    setSimulatedSmsToast(`📲 SMS to ${phone}: Your 4-digit verification code is [${newOtp}]. Valid for 5 mins.`);
  };

  // VERIFY 4-DIGIT PHONE OTP
  const handleVerifyPhoneOtp = () => {
    if (!isPhoneOtpSent) {
      setPhoneOtpError('Pehle "Send OTP" button dabayein taake 4-digit code generate ho.');
      return;
    }
    if (!enteredPhoneOtp || enteredPhoneOtp.trim().length !== 4) {
      setPhoneOtpError('Baraye meharbani mukammal 4-digit OTP code darj kryn.');
      return;
    }
    if (enteredPhoneOtp.trim() !== generatedPhoneOtp.trim()) {
      setPhoneOtpError(`Ghalat code! Aap ne "${enteredPhoneOtp}" likha hy jo bheje gaye code se match nahi karta.`);
      return;
    }

    // SUCCESS MATCH
    setIsPhoneVerified(true);
    setPhoneOtpError('');
    setSimulatedSmsToast(null);
  };

  // SEND 4-DIGIT EMAIL TOKEN
  const handleSendEmailOtp = () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailOtpError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    // Generate random 4-digit token (e.g., 4918)
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedEmailOtp(newOtp);
    setIsEmailOtpSent(true);
    setIsEmailVerified(false);
    setEmailOtpError('');
    setEmailCountdown(60);
    setEnteredEmailOtp('');

    // Show simulated live Email alert
    setSimulatedEmailToast(`📧 Email to ${email}: Your 4-digit confirmation token is [${newOtp}].`);
  };

  // VERIFY 4-DIGIT EMAIL TOKEN
  const handleVerifyEmailOtp = () => {
    if (!isEmailOtpSent) {
      setEmailOtpError('Pehle "Send Token" button dabayein taake email code receive ho.');
      return;
    }
    if (!enteredEmailOtp || enteredEmailOtp.trim().length !== 4) {
      setEmailOtpError('Baraye meharbani mukammal 4-digit Email Token darj kryn.');
      return;
    }
    if (enteredEmailOtp.trim() !== generatedEmailOtp.trim()) {
      setEmailOtpError(`Ghalat Token! Aap ne "${enteredEmailOtp}" likha hy jo bheje gaye token se match nahi karta.`);
      return;
    }

    // SUCCESS MATCH
    setIsEmailVerified(true);
    setEmailOtpError('');
    setSimulatedEmailToast(null);
  };

  // Handle local store logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStepValidationError('Store logo image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStoreLogo(reader.result);
          setStepValidationError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate Legal Name according to CNIC rules (Minimum 2 words, alphabetic only)
  const validateLegalCnicName = (inputName: string): boolean => {
    const trimmed = inputName.trim();
    if (!trimmed || trimmed.length < 3) return false;
    const validCharsRegex = /^[a-zA-Z\s.-]+$/;
    if (!validCharsRegex.test(trimmed)) return false;
    const words = trimmed.split(/\s+/).filter(Boolean);
    return words.length >= 2;
  };

  // Simulate 1Link Title Fetch Check
  const handleFetch1Link = () => {
    setIsFetching1Link(true);
    setTimeout(() => {
      setIsFetching1Link(false);
      setAccountTitle(fullName.toUpperCase());
      setIs1LinkVerified(true);
    }, 800);
  };

  // Validation when clicking NEXT
  const handleNextStep = () => {
    setStepValidationError('');

    // Step 1 check
    if (currentStep === 1) {
      if (!businessName.trim()) {
        setStepValidationError('Please enter your business or brand name.');
        return;
      }
      if (salesChannels.length === 0) {
        setStepValidationError('Please select at least one active selling channel.');
        return;
      }
    }

    // Step 2 check (CNIC) - Strict Name Validation
    if (currentStep === 2) {
      if (!fullName.trim() || !fatherOrHusbandName.trim()) {
        setStepValidationError('Please enter your full legal name and Father/Husband name.');
        return;
      }
      if (!validateLegalCnicName(fullName)) {
        setStepValidationError('نام لازمی طور پر شناختی کارڈ (CNIC) کے مطابق کم از کم 2 الفاظ پر مشتمل ہو (مثال: Muhammad Tariq) بغیر نمبرز یا اسپیشل علامات کے۔');
        return;
      }
      const rawCnic = cnicNumber.replace(/\D/g, '');
      if (rawCnic.length !== 13) {
        setStepValidationError('Please enter a valid 13-digit NADRA CNIC number (00000-0000000-0).');
        return;
      }
      if (!cnicFrontUploaded || !cnicBackUploaded) {
        setStepValidationError('Please attach both Front and Back scans of your CNIC.');
        return;
      }
    }

    // Step 3 check (STRICT OTP VERIFICATION REQUIREMENT)
    if (currentStep === 3) {
      if (!isPhoneVerified) {
        setStepValidationError('⚠️ Mobile number verify nahi hua! Pehle 4-digit SMS OTP code verify kryn.');
        return;
      }
      if (!isEmailVerified) {
        setStepValidationError('⚠️ Business email verify nahi hua! Pehle 4-digit Email Token verify kryn.');
        return;
      }
      if (!fullAddress.trim()) {
        setStepValidationError('Please enter your complete physical warehouse or office address.');
        return;
      }
    }

    // Step 4 check (1Link Banking)
    if (currentStep === 4) {
      if (!ibanOrAccountNumber.trim() || ibanOrAccountNumber.length < 14) {
        setStepValidationError('Please enter a valid 24-character Pakistani IBAN or account number.');
        return;
      }
      if (!accountTitle.trim()) {
        setStepValidationError('Please enter the beneficiary account title matching your CNIC name.');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevStep = () => {
    setStepValidationError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStepValidationError('');

    if (!validateLegalCnicName(fullName)) {
      setStepValidationError('نام شناختی کارڈ (CNIC) کے عین مطابق کم از کم 2 الفاظ پر مشتمل ہو (مثال: Muhammad Tariq)۔');
      setCurrentStep(2);
      return;
    }

    if (!isPhoneVerified || !isEmailVerified) {
      setStepValidationError('Verification incomplete. Phone and Email must be OTP verified.');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);

    const partnerPrefix = role === 'SUPPLIER' ? 'YM-SUP' : 'YM-RES';
    const randCode = Math.floor(100000 + Math.random() * 900000);
    const newId = `${partnerPrefix}-PK-${randCode}-VERIFIED`;

    setTimeout(() => {
      // Register into App State so the new user with logo and settings is immediately active
      const registered = registerUser({
        name: fullName.trim(),
        cnicNumber: cnicNumber,
        fatherOrHusbandName: fatherOrHusbandName.trim(),
        logo: storeLogo,
        avatar: storeLogo,
        email: email.trim(),
        role: role as UserRole,
        companyName: businessName.trim(),
        businessType: businessType,
        phone: phone.trim(),
        city: city,
        province: province,
        fullAddress: fullAddress.trim(),
        postalCode: postalCode.trim(),
        storeUrl: storeWebsiteUrl.trim(),
        salesChannels: salesChannels,
        categories: selectedCategories,
        ntnNumber: ntnNumber.trim(),
        strnNumber: strnSalesTaxNumber.trim(),
        payoutDetails: {
          bankName: bankName,
          accountTitle: accountTitle.trim().toUpperCase() || fullName.trim().toUpperCase(),
          accountNumber: ibanOrAccountNumber.trim(),
          iban: ibanOrAccountNumber.trim().startsWith('PK') ? ibanOrAccountNumber.trim() : undefined
        },
        isVerified: true,
        status: 'ACTIVE',
        referralCode: `YM-${fullName.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setGeneratedPartnerId(newId);

      setTimeout(() => {
        setIsRegisterModalOpen(false);
        setIsSuccess(false);
        setCurrentStep(1);
      }, 2200);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl space-y-6 max-h-[94vh] overflow-y-auto">
        
        {/* MODAL HEADER & VERIFICATION BADGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-white text-lg sm:text-xl tracking-tight">
                  Verified Partner Registration & KYC
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-Bit Encrypted
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Strict 4-Digit OTP, NADRA CNIC, and 1Link bank settlement KYC for Pakistan dropshipping.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="self-end sm:self-auto p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS TRACKER */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs mb-2.5">
            <span className="font-extrabold text-slate-200">
              Step {currentStep} of 5: {
                currentStep === 1 ? 'Role & Business Structure' :
                currentStep === 2 ? 'NADRA CNIC & Identity (KYC)' :
                currentStep === 3 ? 'Contact & 4-Digit OTP Verification' :
                currentStep === 4 ? '1Link / Raast Banking & Settlement' :
                'Capacity, Tax & Legal Agreement'
              }
            </span>
            <span className="text-emerald-400 font-mono font-bold text-[11px]">
              {currentStep * 20}% Completed
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${currentStep * 20}%` }}
            />
          </div>

          {/* Step Pill Indicators */}
          <div className="grid grid-cols-5 gap-1.5 mt-3 text-[10px] text-center font-bold">
            {[
              { num: 1, label: '1. Business' },
              { num: 2, label: '2. CNIC KYC' },
              { num: 3, label: '3. 4-Digit OTP' },
              { num: 4, label: '4. Bank 1Link' },
              { num: 5, label: '5. Contract' }
            ].map((st) => (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  if (st.num < currentStep) {
                    setCurrentStep(st.num);
                    setStepValidationError('');
                  } else if (st.num > currentStep) {
                    handleNextStep();
                  }
                }}
                className={`py-1.5 px-1 rounded-xl transition ${
                  currentStep === st.num
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : currentStep > st.num
                    ? 'bg-slate-900 text-slate-300 border border-slate-800'
                    : 'text-slate-500 bg-transparent'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* VALIDATION WARNING BANNER */}
        {stepValidationError && (
          <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3.5 text-xs text-red-200 flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="font-semibold">{stepValidationError}</span>
          </div>
        )}

        {/* STEP CONTENTS */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ======================================================== */}
          {/* STEP 1: ROLE & BUSINESS IDENTIFICATION */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-400" /> Select Partner Account Architecture
                </h3>
                <span className="text-[11px] text-slate-400">Choose your operational role</span>
              </div>

              {/* Role Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setRole('RESELLER')}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    role === 'RESELLER'
                      ? 'bg-emerald-600/15 border-emerald-500 ring-1 ring-emerald-500 text-white shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-2">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    {role === 'RESELLER' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <h4 className="font-black text-sm text-white">E-Commerce Reseller / Dropshipper</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Sell on Shopify, Daraz, TikTok Shop, or WhatsApp. Earn guaranteed profits on delivered COD orders with zero inventory risk.
                  </p>
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-bold">Auto COD Booking</span>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">T+1 Wallet Settlement</span>
                  </div>
                </div>

                <div
                  onClick={() => setRole('SUPPLIER')}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    role === 'SUPPLIER'
                      ? 'bg-amber-600/15 border-amber-500 ring-1 ring-amber-500 text-white shadow-xl'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 mb-2">
                      <Warehouse className="w-5 h-5" />
                    </div>
                    {role === 'SUPPLIER' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </div>
                  <h4 className="font-black text-sm text-white">Wholesale Supplier / Manufacturer</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    List warehouse stock at bulk prices to 5,000+ active Pakistani dropshippers. Direct courier pickups & automated invoice reconciliations.
                  </p>
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-amber-300 font-bold">Bulk Order Dispatch</span>
                    <span className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">Guaranteed Escrow Sourcing</span>
                  </div>
                </div>
              </div>

              {/* Business Entity Type & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Business Legal Structure</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value="INDIVIDUAL">Individual Freelancer / Sole Dropshipper</option>
                    <option value="SOLE_PROP">Sole Proprietorship (Registered)</option>
                    <option value="PVT_LTD">Private Limited Company (SECP Registered)</option>
                    <option value="PARTNERSHIP">Registered Partnership / AOP</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Registered Business / Brand Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Ecom Ventures"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      FBR NTN Number <span className="text-[10px] text-emerald-400 font-semibold">(Optional / اختیاری)</span>
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">Not Mandatory</span>
                  </label>
                  <input
                    type="text"
                    value={ntnNumber}
                    onChange={(e) => setNtnNumber(e.target.value)}
                    placeholder="Leave blank if you don't have NTN (e.g. 7392018-4)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Individual dropshippers & sellers can leave this empty.</p>
                </div>

                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Store / Website / Social Media URL</label>
                  <input
                    type="text"
                    value={storeWebsiteUrl}
                    onChange={(e) => setStoreWebsiteUrl(e.target.value)}
                    placeholder="https://yourstore.pk or Daraz Store Link"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Store & Brand Logo Upload / Selection */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" /> Store / Business Logo (اسٹور کا لوگو)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload your brand logo or pick a template. This logo will appear on your profile, header, and supplier/reseller pages.
                    </p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    Custom / Preset
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Selected Logo Preview */}
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="relative">
                      <img
                        src={storeLogo}
                        alt="Store Logo"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md bg-slate-900"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Store Logo</span>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold cursor-pointer transition">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Logo from Device (PNG / JPG / WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customLogoUrl}
                        onChange={(e) => setCustomLogoUrl(e.target.value)}
                        placeholder="Or paste direct image URL (https://...)"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLogoUrl.trim()) {
                            setStoreLogo(customLogoUrl.trim());
                            setCustomLogoUrl('');
                          }
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Brand Logos */}
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-400 mb-1.5 block">Quick Brand Logo Badges:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_REGISTRATION_LOGOS.map((preset, idx) => {
                      const isSelected = storeLogo === preset.url;
                      return (
                        <div
                          key={idx}
                          onClick={() => setStoreLogo(preset.url)}
                          className={`p-1.5 rounded-xl border cursor-pointer transition flex flex-col items-center text-center gap-1 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 ring-1 ring-emerald-500'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                          <span className="text-[9px] font-semibold text-slate-300 truncate w-full">{preset.name.split(' ')[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Primary Sales Channels */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 text-xs block">Active Selling / Marketing Channels:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {SALES_CHANNELS.map((ch) => {
                    const isSelected = salesChannels.includes(ch.id);
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => toggleChannel(ch.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{ch.icon}</span>
                        <span className="text-[11px] truncate">{ch.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Categories */}
              <div className="space-y-2">
                <label className="font-bold text-slate-300 text-xs block">Target Product Categories:</label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg border text-[11px] transition ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
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
          {/* STEP 2: NADRA CNIC & IDENTITY VERIFICATION */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-emerald-400" /> NADRA CNIC & Identity Verification (KYC)
                </h3>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NADRA Compliant
                </span>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3.5 text-xs text-slate-300 flex items-start gap-3">
                <InfoIcon />
                <div className="space-y-1">
                  <div>
                    <strong className="text-emerald-400">Strict NADRA CNIC Name Policy:</strong> State Bank of Pakistan (SBP), 1Link, and Courier COD regulations require your account name to match your 13-digit CNIC exactly.
                  </div>
                  <div className="text-[11px] text-emerald-300/90 font-medium">
                    نام لازمی طور پر شناختی کارڈ (CNIC) کے مطابق ہو تاکہ پے آؤٹس اور بینک اکاؤنٹ ویریفکیشن میں کوئی رکاوٹ نہ آئے۔
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Full Legal Name */}
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Full Legal Name (Exact Match with CNIC)</span>
                    {validateLegalCnicName(fullName) ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid CNIC Format
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-bold">
                        Min 2 words (e.g. Ali Raza)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="As printed on CNIC (e.g. Muhammad Tariq Khan)"
                    className={`w-full bg-slate-950 border rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none ${
                      validateLegalCnicName(fullName)
                        ? 'border-emerald-500/60 focus:border-emerald-500'
                        : 'border-amber-500/60 focus:border-amber-500'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    No numbers or special characters allowed. Only official legal name.
                  </p>
                </div>

                {/* Father / Husband Name */}
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Father / Husband Name</label>
                  <input
                    type="text"
                    required
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    placeholder="Father/Husband Name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* CNIC Number */}
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>13-Digit NADRA CNIC Number</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Format: 00000-0000000-0</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cnicNumber}
                      onChange={(e) => handleCnicChange(e.target.value)}
                      placeholder="42101-1234567-1"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                    <div className="absolute right-3 top-2.5">
                      {isCnicVerified ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="font-bold text-slate-300 mb-1.5 block">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* CNIC DOCUMENT UPLOADS SIMULATOR */}
              <div className="space-y-3 pt-2">
                <label className="font-bold text-slate-300 text-xs block">
                  Attach Official CNIC Front & Back Scans (PDF / JPG / PNG):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* CNIC Front */}
                  <div className={`border rounded-2xl p-4 transition ${
                    cnicFrontUploaded
                      ? 'bg-emerald-500/5 border-emerald-500/40'
                      : 'bg-slate-950 border-dashed border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">CNIC Front Side</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {cnicFrontUploaded ? 'Verified (1.4 MB)' : 'Required'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Clear photo showing photo, name & CNIC number.</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCnicFrontUploaded(!cnicFrontUploaded)}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" /> {cnicFrontUploaded ? 'Re-upload Front' : 'Upload Front Scan'}
                      </button>
                    </div>
                  </div>

                  {/* CNIC Back */}
                  <div className={`border rounded-2xl p-4 transition ${
                    cnicBackUploaded
                      ? 'bg-emerald-500/5 border-emerald-500/40'
                      : 'bg-slate-950 border-dashed border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">CNIC Back Side</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        {cnicBackUploaded ? 'Verified (1.1 MB)' : 'Required'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Showing family number, permanent address & barcode.</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCnicBackUploaded(!cnicBackUploaded)}
                        className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" /> {cnicBackUploaded ? 'Re-upload Back' : 'Upload Back Scan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: CONTACT & STRICT 4-DIGIT OTP VERIFICATION */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Real-time 4-Digit OTP Verification
                </h3>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> 4-Digit Code Mandatory
                </span>
              </div>

              {/* SIMULATED LIVE SMS ALERT BANNER */}
              {simulatedSmsToast && (
                <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-3.5 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="font-mono font-bold">{simulatedSmsToast}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredPhoneOtp(generatedPhoneOtp);
                      setPhoneOtpError('');
                    }}
                    className="text-[10px] bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg font-black hover:bg-emerald-400 transition"
                  >
                    Auto-Fill 4-Digit Code
                  </button>
                </div>
              )}

              {/* SIMULATED LIVE EMAIL ALERT BANNER */}
              {simulatedEmailToast && (
                <div className="bg-sky-950/70 border border-sky-500/40 rounded-2xl p-3.5 text-xs text-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span className="font-mono font-bold">{simulatedEmailToast}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEnteredEmailOtp(generatedEmailOtp);
                      setEmailOtpError('');
                    }}
                    className="text-[10px] bg-sky-400 text-slate-950 px-2.5 py-1 rounded-lg font-black hover:bg-sky-300 transition"
                  >
                    Auto-Fill Email Token
                  </button>
                </div>
              )}

              {/* 1. PHONE NUMBER & 4-DIGIT SMS OTP */}
              <div className={`border rounded-2xl p-4 space-y-3 transition ${
                isPhoneVerified
                  ? 'bg-emerald-500/5 border-emerald-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp / Mobile Number:
                  </label>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isPhoneVerified
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isPhoneOtpSent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isPhoneVerified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Phone Number Verified
                      </>
                    ) : isPhoneOtpSent ? (
                      <>
                        <Clock className="w-3 h-3 text-amber-400" /> Code Sent - Enter 4 Digits
                      </>
                    ) : (
                      'Click "Send SMS OTP"'
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Phone Input */}
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      disabled={isPhoneVerified}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setIsPhoneVerified(false);
                        setIsPhoneOtpSent(false);
                        setGeneratedPhoneOtp('');
                        setEnteredPhoneOtp('');
                        setPhoneOtpError('');
                      }}
                      placeholder="03001234567"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-70"
                    />
                  </div>

                  {/* Send OTP button */}
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      disabled={isPhoneVerified || phoneCountdown > 0}
                      onClick={handleSendPhoneOtp}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl px-3 py-2 transition flex items-center justify-center gap-1.5 border border-slate-700 disabled:opacity-50"
                    >
                      {phoneCountdown > 0 ? (
                        <span className="text-amber-400 font-mono">Resend ({phoneCountdown}s)</span>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-emerald-400" /> {isPhoneOtpSent ? 'Resend SMS' : 'Send SMS OTP'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* 4-Digit OTP Code Input */}
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      maxLength={4}
                      disabled={!isPhoneOtpSent || isPhoneVerified}
                      value={enteredPhoneOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setEnteredPhoneOtp(val);
                        setPhoneOtpError('');
                      }}
                      placeholder="4 Digits"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-center text-white font-mono font-bold tracking-widest text-xs focus:outline-none focus:border-emerald-500 disabled:opacity-40"
                    />
                  </div>

                  {/* Verify Code Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      disabled={isPhoneVerified || !isPhoneOtpSent || enteredPhoneOtp.length !== 4}
                      onClick={handleVerifyPhoneOtp}
                      className={`w-full font-bold text-xs rounded-xl px-2 py-2 transition flex items-center justify-center gap-1 ${
                        isPhoneVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow disabled:opacity-40'
                      }`}
                    >
                      {isPhoneVerified ? '✓ Done' : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* Phone error message */}
                {phoneOtpError && (
                  <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> {phoneOtpError}
                  </p>
                )}
              </div>

              {/* 2. EMAIL ADDRESS & 4-DIGIT TOKEN */}
              <div className={`border rounded-2xl p-4 space-y-3 transition ${
                isEmailVerified
                  ? 'bg-sky-500/5 border-sky-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" /> Official Business Email:
                  </label>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isEmailVerified
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : isEmailOtpSent
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {isEmailVerified ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-sky-400" /> Email Verified
                      </>
                    ) : isEmailOtpSent ? (
                      <>
                        <Clock className="w-3 h-3 text-amber-400" /> Token Sent - Enter 4 Digits
                      </>
                    ) : (
                      'Click "Send Token"'
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Email Input */}
                  <div className="sm:col-span-5">
                    <input
                      type="email"
                      disabled={isEmailVerified}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsEmailVerified(false);
                        setIsEmailOtpSent(false);
                        setGeneratedEmailOtp('');
                        setEnteredEmailOtp('');
                        setEmailOtpError('');
                      }}
                      placeholder="name@business.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-500 disabled:opacity-70"
                    />
                  </div>

                  {/* Send Token Button */}
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      disabled={isEmailVerified || emailCountdown > 0}
                      onClick={handleSendEmailOtp}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl px-3 py-2 transition flex items-center justify-center gap-1.5 border border-slate-700 disabled:opacity-50"
                    >
                      {emailCountdown > 0 ? (
                        <span className="text-amber-400 font-mono">Resend ({emailCountdown}s)</span>
                      ) : (
                        <>
                          <Send className="w-3 h-3 text-sky-400" /> {isEmailOtpSent ? 'Resend Token' : 'Send Token'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* 4-Digit Token Input */}
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      maxLength={4}
                      disabled={!isEmailOtpSent || isEmailVerified}
                      value={enteredEmailOtp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setEnteredEmailOtp(val);
                        setEmailOtpError('');
                      }}
                      placeholder="4 Digits"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2 py-2 text-center text-white font-mono font-bold tracking-widest text-xs focus:outline-none focus:border-sky-500 disabled:opacity-40"
                    />
                  </div>

                  {/* Verify Token Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      disabled={isEmailVerified || !isEmailOtpSent || enteredEmailOtp.length !== 4}
                      onClick={handleVerifyEmailOtp}
                      className={`w-full font-bold text-xs rounded-xl px-2 py-2 transition flex items-center justify-center gap-1 ${
                        isEmailVerified
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow disabled:opacity-40'
                      }`}
                    >
                      {isEmailVerified ? '✓ Done' : 'Verify'}
                    </button>
                  </div>
                </div>

                {/* Email error message */}
                {emailOtpError && (
                  <p className="text-[11px] text-red-400 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> {emailOtpError}
                  </p>
                )}
              </div>

              {/* Physical Operating & Dispatch Address */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Physical Warehouse / Office / Return Address:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Province (PST Region)</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Punjab">Punjab (PRA 16%)</option>
                      <option value="Sindh">Sindh (SRB 15%)</option>
                      <option value="KPK">Khyber Pakhtunkhwa (KPRA 15%)</option>
                      <option value="Balochistan">Balochistan (BRA 15%)</option>
                      <option value="Islamabad">Islamabad Capital Territory (16%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Operating City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 75400"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs block mb-1">Complete Street / Plaza / Warehouse Address</label>
                  <textarea
                    rows={2}
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Floor, Building name, Street, Area landmark..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: 1LINK / RAAST BANKING & SETTLEMENT */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> 1Link & Raast Bank Account Settlement (KYC)
                </h3>
                <span className="text-[11px] text-slate-400">Daily Automated COD Payouts</span>
              </div>

              {/* Settlement Method Selector */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'IBAN', title: 'Commercial IBAN', subtitle: 'Any Pakistani Bank' },
                  { id: 'RAAST', title: 'Raast ID P2M', subtitle: 'Instant SBP Settlement' },
                  { id: 'WALLET', title: 'EMI / Mobile Wallet', subtitle: 'SadaPay / JazzCash' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayoutMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      payoutMethod === m.id
                        ? 'bg-emerald-600/15 border-emerald-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{m.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.subtitle}</p>
                  </button>
                ))}
              </div>

              {/* Bank Details Form */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-300 mb-1 block">Beneficiary Commercial Bank / EMI Institution</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    {PAKISTAN_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account / IBAN */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span>24-Character IBAN / Account Number</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Starts with PK</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={ibanOrAccountNumber}
                      onChange={(e) => setIbanOrAccountNumber(e.target.value)}
                      placeholder="PK92MEZN0001234567890102"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Account Title */}
                  <div>
                    <label className="font-bold text-slate-300 mb-1 flex items-center justify-between">
                      <span>Account Title (Beneficiary Name)</span>
                      <button
                        type="button"
                        onClick={handleFetch1Link}
                        disabled={isFetching1Link}
                        className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isFetching1Link ? 'animate-spin' : ''}`} />
                        1Link Title Fetch
                      </button>
                    </label>
                    <input
                      type="text"
                      required
                      value={accountTitle}
                      onChange={(e) => setAccountTitle(e.target.value)}
                      placeholder="MUST MATCH CNIC NAME"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 1Link Verification Status Card */}
                <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      1L
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">1Link Title Verification Status:</p>
                      <p className="text-[11px] text-emerald-300 font-mono">
                        Title Match: {accountTitle} (Active Account)
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: CAPACITY, TAX & LEGAL AGREEMENT */}
          {/* ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" /> Operational Capacity & Legal Partner Agreement
                </h3>
                <span className="text-[11px] text-slate-400">Final Step</span>
              </div>

              {/* Role specific capacity questions */}
              {role === 'SUPPLIER' ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Warehouse className="w-3.5 h-3.5 text-amber-400" /> Wholesale Supplier Warehouse Capacity:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Warehouse Area (Sq. Ft)</label>
                      <input
                        type="number"
                        value={warehouseCapacitySqFt}
                        onChange={(e) => setWarehouseCapacitySqFt(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Daily Dispatch Capacity (Orders/Day)</label>
                      <input
                        type="number"
                        value={dailyDispatchCapacity}
                        onChange={(e) => setDailyDispatchCapacity(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Return / RTO Processing SLA (Hours)</label>
                      <input
                        type="number"
                        value={returnSlaHours}
                        onChange={(e) => setReturnSlaHours(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" /> E-Commerce Reseller Projected Volume:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Expected Monthly Order Volume</label>
                      <select
                        value={expectedMonthlyOrders}
                        onChange={(e) => setExpectedMonthlyOrders(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="50-200 orders/month">50 - 200 orders/month (Starting)</option>
                        <option value="200-500 orders/month">200 - 500 orders/month (Growth)</option>
                        <option value="500-2000 orders/month">500 - 2,000 orders/month (High Scale)</option>
                        <option value="2000+ orders/month">2,000+ orders/month (Super Seller)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Sales Tax / STRN (If Sales Tax Registered)</label>
                      <input
                        type="text"
                        value={strnSalesTaxNumber}
                        onChange={(e) => setStrnSalesTaxNumber(e.target.value)}
                        placeholder="Optional"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MANDATORY LEGAL DECLARATIONS & TERMS */}
              <div className="space-y-3 pt-2">
                <label className="font-bold text-slate-300 text-xs block">
                  Mandatory Legal Compliance & Settlement Declarations:
                </label>

                <div className="space-y-2.5 text-xs">
                  <label className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeCodPolicy}
                      onChange={(e) => setAgreeCodPolicy(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-slate-300 leading-snug">
                      <strong>COD Remittance & Escrow Terms:</strong> I acknowledge that funds collected from Cash-on-Delivery orders will be settled to my verified bank account according to the standard T+1 / T+2 settlement cycle after courier delivery confirmation.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeAntiCounterfeit}
                      onChange={(e) => setAgreeAntiCounterfeit(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-slate-300 leading-snug">
                      <strong>Authenticity & Zero-Fraud Guarantee:</strong> I declare that all products listed or fulfilled are genuine, accurately described, and comply with Consumer Protection laws of Pakistan.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTermsAndTax}
                      onChange={(e) => setAgreeTermsAndTax(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-slate-300 leading-snug">
                      <strong>Tax Compliance & Terms of Service:</strong> I accept the platform terms, privacy policy, and provincial sales tax (PST) deduction rules on transaction services.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS BANNER */}
          {isSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-5 text-center space-y-2 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-black text-xl">
                ✓
              </div>
              <h3 className="text-white font-black text-lg">Partner Account Successfully Verified & Registered!</h3>
              <p className="text-xs text-emerald-300 font-mono">
                Assigned ID: {generatedPartnerId}
              </p>
              <p className="text-xs text-slate-400">
                Switching you to the verified <strong>{role === 'SUPPLIER' ? 'Wholesale Supplier' : 'E-Commerce Reseller'}</strong> dashboard...
              </p>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous Step
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Continue to Step {currentStep + 1} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !agreeCodPolicy || !agreeAntiCounterfeit || !agreeTermsAndTax}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs transition shadow-xl shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Registering...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Submit Verified Registration
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

const InfoIcon = () => (
  <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2"></line>
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2"></line>
  </svg>
);

export default RegisterModal;
