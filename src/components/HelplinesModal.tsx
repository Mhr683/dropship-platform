import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  Copy,
  ShieldCheck,
  ShoppingBag,
  Briefcase,
  Factory,
  Headphones,
  Pencil,
  Save,
  RotateCcw,
  Lock,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { PlatformHelplinesConfig, HelplineContact } from '../types';

interface HelplinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  helplinesConfig: PlatformHelplinesConfig;
  onUpdateHelplinesConfig?: (newConfig: PlatformHelplinesConfig) => void;
  isAdminAuthenticated?: boolean;
  onOpenAdminAuth?: () => void;
  onLogAudit?: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

export const HelplinesModal: React.FC<HelplinesModalProps> = ({
  isOpen,
  onClose,
  helplinesConfig,
  onUpdateHelplinesConfig,
  isAdminAuthenticated = false,
  onOpenAdminAuth,
  onLogAudit,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState<PlatformHelplinesConfig>({ ...helplinesConfig });

  // Sync form data whenever helplinesConfig prop changes
  useEffect(() => {
    setFormData({
      buyersHelpline: { ...helplinesConfig.buyersHelpline },
      resellersHelpline: { ...helplinesConfig.resellersHelpline },
      manufacturersHelpline: { ...helplinesConfig.manufacturersHelpline },
    });
  }, [helplinesConfig, isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (
    section: 'buyersHelpline' | 'resellersHelpline' | 'manufacturersHelpline',
    field: keyof HelplineContact,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onUpdateHelplinesConfig) {
      onUpdateHelplinesConfig(formData);
    }
    if (onLogAudit) {
      onLogAudit(
        'HELPLINES_CONFIG_UPDATED',
        `Updated helpline phone numbers, WhatsApp, & email lines for Buyers, Resellers, and Manufacturers`,
        'SUCCESS'
      );
    }
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleResetForm = () => {
    setFormData({
      buyersHelpline: { ...helplinesConfig.buyersHelpline },
      resellersHelpline: { ...helplinesConfig.resellersHelpline },
      manufacturersHelpline: { ...helplinesConfig.manufacturersHelpline },
    });
    setIsEditing(false);
  };

  const helplineSections = [
    {
      id: 'buyers' as const,
      formKey: 'buyersHelpline' as const,
      title: 'Buyers & Retail Customer Helpline',
      subtitle: 'For retail order tracking, delivery queries, COD verifications & returns',
      icon: ShoppingBag,
      color: 'blue',
      badge: 'B2C Storefront Support',
      borderClass: 'border-blue-500/30 hover:border-blue-500/60',
      bgGradient: 'from-blue-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      btnCall: 'bg-blue-600 hover:bg-blue-500 text-white',
      btnWa: 'bg-emerald-600/90 hover:bg-emerald-500 text-white',
      contact: isEditing ? formData.buyersHelpline : helplinesConfig.buyersHelpline,
    },
    {
      id: 'resellers' as const,
      formKey: 'resellersHelpline' as const,
      title: 'Resellers Dedicated Helpline',
      subtitle: 'For profit margin clearance, Profit Guard locks, instant payouts & Daraz sync',
      icon: Briefcase,
      color: 'emerald',
      badge: 'Pro Reseller Desk',
      borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
      bgGradient: 'from-emerald-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      btnCall: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      btnWa: 'bg-emerald-600/90 hover:bg-emerald-500 text-white',
      contact: isEditing ? formData.resellersHelpline : helplinesConfig.resellersHelpline,
    },
    {
      id: 'manufacturers' as const,
      formKey: 'manufacturersHelpline' as const,
      title: 'Manufacturer & Supplier Helpline',
      subtitle: 'For factory stock onboarding, wholesale bulk pricing & warehouse escrow payouts',
      icon: Factory,
      color: 'amber',
      badge: 'Factory & Wholesaler Hub',
      borderClass: 'border-amber-500/30 hover:border-amber-500/60',
      bgGradient: 'from-amber-950/40 via-slate-900 to-slate-900',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      btnCall: 'bg-amber-600 hover:bg-amber-500 text-white',
      btnWa: 'bg-emerald-600/90 hover:bg-emerald-500 text-white',
      contact: isEditing ? formData.manufacturersHelpline : helplinesConfig.manufacturersHelpline,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Official Support & Help Centers
                </h2>
                {isEditing ? (
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Pencil className="h-2.5 w-2.5" />
                    Admin Edit Mode
                  </span>
                ) : (
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Modify helpline numbers, WhatsApp contacts, support emails, and operating hours.'
                  : 'Direct phone, WhatsApp, and email lines for Buyers, Resellers, and Manufacturers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Controls */}
            {isAdminAuthenticated ? (
              isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-bold transition border border-slate-700"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveChanges()}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-lg shadow-emerald-950"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 text-xs font-bold transition shadow-lg shadow-purple-950"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span>Edit Helplines</span>
                </button>
              )
            ) : (
              /* Discreet Admin Lock Button for Developer */
              onOpenAdminAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminAuth();
                  }}
                  className="rounded-lg p-1.5 text-slate-500 hover:text-purple-400 hover:bg-slate-800/80 transition"
                  title="Master Admin Login"
                >
                  <Lock className="h-3.5 w-3.5" />
                </button>
              )
            )}

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {saveSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2.5 flex items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">
                Helplines updated successfully! All changes are live and saved to platform configuration.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSaveSuccess(false)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {helplineSections.map((sec) => {
              const Icon = sec.icon;
              const contact = sec.contact;
              const cleanPhone = (contact.phone || '').replace(/[^0-9+]/g, '');
              const cleanWa = (contact.whatsapp || contact.phone || '').replace(/[^0-9]/g, '');

              return (
                <div
                  key={sec.id}
                  className={`flex flex-col justify-between rounded-xl border bg-gradient-to-b ${sec.bgGradient} p-5 transition-all shadow-lg ${sec.borderClass}`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${sec.iconBg}`}>
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${sec.badgeClass}`}>
                            {sec.badge}
                          </span>
                          <h3 className="text-sm font-bold text-white leading-snug">
                            {sec.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {isEditing ? (
                      <div className="mb-3 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={contact.description || ''}
                          onChange={(e) =>
                            handleFieldChange(sec.formKey, 'description', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                          placeholder="Section description..."
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                        {contact.description || sec.subtitle}
                      </p>
                    )}

                    {/* Operational Timings */}
                    {isEditing ? (
                      <div className="mb-3 space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>Operational Timings</span>
                        </label>
                        <input
                          type="text"
                          value={contact.timings || ''}
                          onChange={(e) =>
                            handleFieldChange(sec.formKey, 'timings', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                          placeholder="e.g. 9:00 AM - 10:00 PM (Mon - Sun)"
                        />
                      </div>
                    ) : (
                      contact.timings && (
                        <div className="flex items-center gap-2 rounded-lg bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs text-slate-300 mb-3">
                          <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-slate-300 truncate">
                            {contact.timings}
                          </span>
                        </div>
                      )
                    )}

                    {/* Contact Fields */}
                    <div className="space-y-3 mb-4">
                      {/* Phone */}
                      {isEditing ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>Phone Helpline Number</span>
                          </label>
                          <input
                            type="text"
                            value={contact.phone || ''}
                            onChange={(e) =>
                              handleFieldChange(sec.formKey, 'phone', e.target.value)
                            }
                            className="w-full rounded-lg border border-emerald-500/40 bg-slate-950 px-2.5 py-1.5 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                            placeholder="+92-300-1122334"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg bg-slate-950/90 border border-slate-800/80 p-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-medium text-slate-400 block leading-none mb-0.5">
                                Phone Helpline
                              </span>
                              <span className="text-xs font-bold font-mono text-slate-100 truncate block">
                                {contact.phone}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(contact.phone, `${sec.id}-phone`)}
                            className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition"
                            title="Copy phone number"
                          >
                            {copiedKey === `${sec.id}-phone` ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* WhatsApp (In Edit Mode) */}
                      {isEditing && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp Number</span>
                          </label>
                          <input
                            type="text"
                            value={contact.whatsapp || ''}
                            onChange={(e) =>
                              handleFieldChange(sec.formKey, 'whatsapp', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none"
                            placeholder="+92-300-1122334"
                          />
                        </div>
                      )}

                      {/* Email */}
                      {isEditing ? (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>Support Email Address</span>
                          </label>
                          <input
                            type="email"
                            value={contact.email || ''}
                            onChange={(e) =>
                              handleFieldChange(sec.formKey, 'email', e.target.value)
                            }
                            className="w-full rounded-lg border border-cyan-500/40 bg-slate-950 px-2.5 py-1.5 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="support@yourmart.pk"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg bg-slate-950/90 border border-slate-800/80 p-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] font-medium text-slate-400 block leading-none mb-0.5">
                                Support Email
                              </span>
                              <span className="text-xs font-bold font-mono text-slate-100 truncate block">
                                {contact.email}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCopy(contact.email, `${sec.id}-email`)}
                            className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] text-slate-300 transition"
                            title="Copy email address"
                          >
                            {copiedKey === `${sec.id}-email` ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions / Live Preview Buttons */}
                  {!isEditing && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                      <a
                        href={`tel:${cleanPhone}`}
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition shadow ${sec.btnCall}`}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Call Now</span>
                      </a>
                      <a
                        href={`https://wa.me/${cleanWa}?text=Hello%20YourMart%20Support,%20I%20need%20assistance.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold transition shadow ${sec.btnWa}`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3.5">
          <div className="text-xs text-slate-500 font-mono">
            {isAdminAuthenticated ? (
              <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Master Admin Session Verified • Software Creator Authorized</span>
              </span>
            ) : (
              <span>YourMart Verified Direct Customer, Reseller & Supplier Lines</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveChanges()}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 text-xs font-bold transition shadow-lg shadow-emerald-950"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Helpline Settings</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2 text-xs font-bold transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
