import React, { useState, useRef, useEffect } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  Waves, 
  Camera, 
  Wrench, 
  Gauge, 
  Building2, 
  AlertOctagon, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  FileText, 
  Send, 
  ShieldCheck, 
  Radio,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface ComplaintTypeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor?: string;
}

const COMPLAINT_TYPES: ComplaintTypeOption[] = [
  {
    id: 'visible_leak',
    title: 'Visible Water Leak',
    subtitle: 'Surface water seepage or road puddle from pipe',
    icon: Droplets
  },
  {
    id: 'burst_pipe',
    title: 'Burst Pipe',
    subtitle: 'High-pressure water geyser or ruptured main',
    icon: AlertOctagon
  },
  {
    id: 'waterlogging',
    title: 'Flooding / Waterlogging',
    subtitle: 'Submerged street, drain backflow or pathway flood',
    icon: Waves
  },
  {
    id: 'damaged_cctv',
    title: 'Damaged CCTV Camera',
    subtitle: 'Vandalized, tilted or offline surveillance unit',
    icon: Camera
  },
  {
    id: 'open_manhole',
    title: 'Unlatched or Open Manhole',
    subtitle: 'Hazardous missing or broken civic utility cover',
    icon: AlertTriangle
  },
  {
    id: 'damaged_pipeline',
    title: 'Damaged Pipeline Infrastructure',
    subtitle: 'Exposed pipe, cracked collar or valve vandalism',
    icon: Wrench
  },
  {
    id: 'supply_issue',
    title: 'Water Supply Issue',
    subtitle: 'Low pressure, muddy water, or erratic delivery schedule',
    icon: Gauge
  },
  {
    id: 'other_civic',
    title: 'Other Civic Water Infrastructure Issue',
    subtitle: 'General water utility hazard or public grievance',
    icon: Building2
  }
];

interface SubmittedComplaint {
  referenceNumber: string;
  category: string;
  location: string;
  description: string;
  submittedAt: string;
}

interface CitizenComplaintPortalProps {
  onBackToDashboard?: () => void;
}

export const CitizenComplaintPortal: React.FC<CitizenComplaintPortalProps> = ({
  onBackToDashboard
}) => {
  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ category?: string; location?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Confirmation State
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<SubmittedComplaint | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reliable scroll reset helper: resets both window and the application's overflow-y-auto container
  const scrollToTop = () => {
    window.scrollTo(0, 0);
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  };

  // Automatically scroll to the top immediately upon mounting the portal
  useEffect(() => {
    scrollToTop();
  }, []);

  // Handle Photo Attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveAttachment = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Validation & Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { category?: string; location?: string; description?: string } = {};

    if (!selectedCategory) {
      newErrors.category = 'Please select a complaint category';
    }
    if (!location.trim()) {
      newErrors.location = 'Please enter the incident location';
    }
    if (!description.trim()) {
      newErrors.description = 'Please describe the observed problem';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide a little more detail (at least 10 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate Network Registration (450ms)
    setTimeout(() => {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const generatedRef = `JD-BLR-2026-${randomDigits}`;
      const categoryObj = COMPLAINT_TYPES.find(c => c.id === selectedCategory);

      const now = new Date();
      const formattedTime = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ', ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';

      setSubmittedData({
        referenceNumber: generatedRef,
        category: categoryObj?.title || 'Civic Infrastructure Grievance',
        location: location.trim(),
        description: description.trim(),
        submittedAt: formattedTime
      });

      // Clear / Remove the photo attachment after submission as instructed
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setAttachedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      scrollToTop();
    }, 450);
  };

  // Reset to form to submit another complaint
  const handleResetForm = () => {
    setSelectedCategory('');
    setLocation('');
    setDescription('');
    setAttachedFile(null);
    setPreviewUrl(null);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
    scrollToTop();
  };

  const handleCopyReference = () => {
    if (submittedData?.referenceNumber) {
      navigator.clipboard.writeText(submittedData.referenceNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none font-sans">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F4F5F7] border border-[#E5E7EB] text-xs font-mono-tech font-bold text-[#144230] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          )}
          <span className="text-[11px] font-mono-tech font-bold px-2.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7]">
            BWSSB CIVIC GRIEVANCE PORTAL
          </span>
        </div>

        <div className="text-xs text-[#6B7280] font-mono-tech flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#144230]" />
          <span>CIVIC DISPATCH: 24x7 ACTIVE</span>
        </div>
      </div>

      {/* Main Container */}
      {!isSubmitted ? (
        /* ========================================================================= */
        /* VIEW A: COMPLAINT SUBMISSION FORM                                         */
        /* ========================================================================= */
        <div className="donezo-card p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="border-b border-[#ECEEF2] pb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-[#144230] text-white flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#111827] tracking-tight">
                  Citizen Complaint Portal
                </h1>
                <p className="text-xs md:text-sm text-[#6B7280] mt-0.5">
                  Report visible water leaks, pipeline ruptures, manhole hazards, or utility disruptions in your neighborhood.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] mt-4 flex items-start gap-2.5 text-xs text-[#4B5563]">
              <HelpCircle className="w-4 h-4 text-[#144230] shrink-0 mt-0.5" />
              <span>
                Your report will be automatically logged and routed to the corresponding Bengaluru Water Supply and Sewerage Board (BWSSB) zone maintenance division for immediate inspection.
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* SECTION 1: COMPLAINT TYPE */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-display font-bold text-sm text-[#111827] flex items-center gap-1.5">
                  <span>1. Select Complaint Category</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-mono-tech text-[#6B7280]">
                  SELECT ONE OPTION
                </span>
              </div>

              {errors.category && (
                <p className="text-xs text-red-600 font-semibold mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errors.category}</span>
                </p>
              )}

              {/* Selectable Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {COMPLAINT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedCategory === type.id;

                  return (
                    <div
                      key={type.id}
                      onClick={() => {
                        setSelectedCategory(type.id);
                        if (errors.category) {
                          setErrors(prev => ({ ...prev, category: undefined }));
                        }
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative ${
                        isSelected
                          ? 'bg-[#E8F7EE] border-[#144230] shadow-sm ring-1 ring-[#144230]'
                          : 'bg-white hover:bg-[#F9FAFB] border-[#ECEEF2] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#144230] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-2 rounded-xl ${
                          isSelected ? 'bg-[#144230] text-white' : 'bg-[#F4F5F7] text-[#144230]'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold text-xs text-[#111827] leading-tight">
                          {type.title}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#6B7280] leading-snug">
                        {type.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: LOCATION */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="complaint-location" className="font-display font-bold text-sm text-[#111827] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#144230]" />
                  <span>2. Incident Location / Landmark</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-mono-tech text-[#6B7280]">
                  STREET, AREA OR LANDMARK
                </span>
              </div>

              <input
                id="complaint-location"
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
                }}
                placeholder="e.g. MG Road, Near Metro Pillar 124, Indiranagar, Bengaluru"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                  errors.location
                    ? 'border-red-400 bg-red-50/50 focus:border-red-600 focus:outline-none'
                    : 'border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-[#144230] focus:outline-none'
                }`}
              />
              {errors.location ? (
                <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errors.location}</span>
                </p>
              ) : (
                <p className="text-[11px] text-[#6B7280] mt-1.5 font-mono-tech">
                  Example: 100 Feet Road, Koramangala 5th Block, near Water Tank
                </p>
              )}
            </div>

            {/* SECTION 3: DESCRIPTION / GRIEVANCE */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="complaint-description" className="font-display font-bold text-sm text-[#111827] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#144230]" />
                  <span>3. Description / Grievance Details</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-mono-tech text-[#6B7280]">
                  {description.length} CHARS
                </span>
              </div>

              <textarea
                id="complaint-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                }}
                placeholder="Water is continuously leaking from a damaged pipeline near the roadside. The flow rate has intensified over the last 2 hours and water is pooling on the pedestrian pathway."
                className={`w-full p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all resize-y ${
                  errors.description
                    ? 'border-red-400 bg-red-50/50 focus:border-red-600 focus:outline-none'
                    : 'border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:border-[#144230] focus:outline-none'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* SECTION 4: PHOTO ATTACHMENT (PURELY FOR DEMO - LOCAL BROWSER STATE ONLY) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-display font-bold text-sm text-[#111827] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#144230]" />
                  <span>4. Photo Attachment (Optional)</span>
                </label>
                <span className="text-[10px] font-mono-tech text-[#6B7280]">
                  DEMO ATTACHMENT • NOT STORED ON SERVER
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-attachment-input"
              />

              {!attachedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#144230] bg-[#F9FAFB] hover:bg-[#F4F5F7] transition-all cursor-pointer text-center group"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-[#E8F7EE] text-[#144230] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-6 h-6 text-[#144230]" />
                  </div>
                  <div className="font-display font-bold text-xs sm:text-sm text-[#111827]">
                    Click to attach a photo from your device
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1 font-mono-tech">
                    Supports JPG, PNG, WEBP (Demonstration state only)
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Attachment preview"
                        className="w-14 h-14 object-cover rounded-xl border border-[#E5E7EB]"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span className="font-display font-bold text-xs text-[#111827] truncate">
                          {attachedFile.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono-tech text-[#6B7280] block mt-0.5">
                        {(attachedFile.size / 1024).toFixed(1)} KB • Attached for demonstration
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    className="p-2 rounded-xl bg-[#F4F5F7] hover:bg-[#FEE2E2] text-[#6B7280] hover:text-[#DC2626] transition-colors cursor-pointer"
                    title="Remove attachment"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* SUBMIT COMPLAINT BUTTON */}
            <div className="pt-4 border-t border-[#ECEEF2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] font-mono-tech text-[#6B7280]">
                By submitting, your complaint enters the 24x7 JalDrishti civic inspection queue.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-sm tracking-wide transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Registering Complaint...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#22C55E]" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW B: COMPLAINT CONFIRMATION & AMAZON-STYLE STATUS TIMELINE             */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Top Confirmation Banner Card */}
          <div className="donezo-card p-6 md:p-8 bg-white border border-[#ECEEF2] text-center relative overflow-hidden">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#144230] via-[#22C55E] to-[#144230]" />

            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-[#E8F7EE] text-[#144230] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-9 h-9 text-[#22C55E]" />
            </div>

            <span className="text-[10px] font-mono-tech font-bold px-3 py-1 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] uppercase tracking-wider">
              OFFICIAL REGISTRATION CONFIRMED
            </span>

            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#111827] mt-3 tracking-tight">
              YOUR COMPLAINT HAS BEEN REGISTERED
            </h2>

            <p className="text-xs md:text-sm text-[#4B5563] max-w-xl mx-auto mt-2 leading-relaxed">
              Your complaint has been successfully registered and will be reviewed by the relevant JalDrishti operations team.
            </p>

            {/* Reference Number Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-tech">
              <div className="text-left">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider block font-bold">
                  Complaint Reference Number
                </span>
                <span className="font-display font-black text-xl text-[#144230] tracking-wider">
                  {submittedData?.referenceNumber}
                </span>
              </div>

              <button
                onClick={handleCopyReference}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F4F5F7] border border-[#D1D5DB] text-xs font-bold text-[#111827] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>Copy Ref</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Complaint Details Summary */}
          <div className="donezo-card p-5 md:p-6 bg-white border border-[#ECEEF2] font-mono-tech text-xs">
            <h3 className="font-display font-bold text-sm text-[#111827] mb-3 pb-2 border-b border-[#F0F2F5]">
              Summary of Registered Report
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block font-bold mb-0.5">CATEGORY</span>
                <span className="font-bold text-[#111827] truncate block">{submittedData?.category}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block font-bold mb-0.5">LOCATION</span>
                <span className="font-bold text-[#111827] truncate block">{submittedData?.location}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block font-bold mb-0.5">TIMESTAMP</span>
                <span className="font-bold text-[#111827] truncate block">{submittedData?.submittedAt}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block font-bold mb-0.5">CURRENT STAGE</span>
                <span className="font-bold text-[#144230] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>Complaint Registered</span>
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#6B7280] block font-bold mb-0.5">GRIEVANCE DESCRIPTION</span>
              <p className="text-[#374151] font-sans text-xs leading-relaxed">
                {submittedData?.description}
              </p>
            </div>
          </div>

          {/* COMPLAINT STATUS TIMELINE (Amazon-style Delivery Progress Timeline) */}
          <div className="donezo-card p-6 md:p-8 bg-white border border-[#ECEEF2] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0F2F5]">
              <div>
                <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#144230] font-bold block">
                  LIVE TRACKING
                </span>
                <h3 className="font-display font-bold text-lg text-[#111827]">
                  Complaint Progress Timeline
                </h3>
              </div>
              <span className="text-xs font-mono-tech px-3 py-1 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] font-bold">
                STAGE 1 OF 7 COMPLETED
              </span>
            </div>

            {/* 7-Stage Delivery Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5E7EB]">
              {/* STAGE 1: Complaint Registered (COMPLETED / ACTIVE) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-[#144230] text-white flex items-center justify-center shadow-xs ring-4 ring-white">
                  <Check className="w-3.5 h-3.5 stroke-[3] text-[#22C55E]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display font-bold text-sm md:text-base text-[#111827]">
                      1. Complaint Registered
                    </h4>
                    <span className="text-[9px] font-mono-tech px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#144230] border border-[#B7E4C7] font-bold">
                      COMPLETED • JUST NOW
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                    Your complaint has been successfully registered and assigned reference #{submittedData?.referenceNumber}.
                  </p>
                </div>
              </div>

              {/* STAGE 2: Complaint Received (PENDING / NEXT) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#144230] text-[#144230] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-2 h-2 rounded-full bg-[#144230]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-[#111827]">
                      2. Complaint Received
                    </h4>
                    <span className="text-[9px] font-mono-tech text-[#6B7280]">
                      IN PROGRESS
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                    Your report is being routed to the central JalDrishti operations dispatch.
                  </p>
                </div>
              </div>

              {/* STAGE 3: Under Review (PENDING) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#6B7280]">
                    3. Under Review
                  </h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                    The issue will be reviewed by the relevant authority.
                  </p>
                </div>
              </div>

              {/* STAGE 4: Inspection / Verification (PENDING) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#6B7280]">
                    4. Inspection / Verification
                  </h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                    The reported issue may be inspected or verified.
                  </p>
                </div>
              </div>

              {/* STAGE 5: Assigned to Operations Team (PENDING) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#6B7280]">
                    5. Assigned to Operations Team
                  </h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                    A suitable maintenance or operations team will be assigned.
                  </p>
                </div>
              </div>

              {/* STAGE 6: Issue Resolution (PENDING) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#6B7280]">
                    6. Issue Resolution
                  </h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                    Necessary action will be taken to address the reported problem.
                  </p>
                </div>
              </div>

              {/* STAGE 7: Resolved (PENDING) */}
              <div className="relative group">
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full bg-white border-2 border-[#D1D5DB] text-[#9CA3AF] flex items-center justify-center shadow-2xs ring-4 ring-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm text-[#6B7280]">
                    7. Resolved
                  </h4>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">
                    The complaint will be marked resolved once the issue has been addressed.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#ECEEF2] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#D1D5DB] font-display font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <FileText className="w-4 h-4 text-[#144230]" />
                <span>Submit Another Complaint</span>
              </button>

              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#144230] hover:bg-[#1A543E] text-white font-display font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-[#22C55E]" />
                  <span>Return to Operations Deck</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenComplaintPortal;
