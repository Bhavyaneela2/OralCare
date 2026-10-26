import React, { useState } from 'react';
import { ToothLogo } from './ToothLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  Sparkles,
  HeartHandshake,
  ChevronRight,
  Download,
  CheckCircle2,
  X,
  Calendar,
  AlertCircle,
  Award,
  Stethoscope,
  Send,
} from 'lucide-react';

interface FooterBannerProps {
  onNavigateTab?: (tab: string) => void;
  currentUserRole?: string;
}

interface ServiceInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  duration: string;
  benefits: string[];
}

const SERVICES_DATA: ServiceInfo[] = [
  {
    id: 'dental-checkups',
    name: 'Dental Checkups',
    category: 'Preventive Care',
    description:
      'Comprehensive oral examination supported by AI-assisted diagnostics, intraoral cameras, and periodontal probing to detect issues before they escalate.',
    priceRange: '₹500 – ₹800',
    duration: '30 mins',
    benefits: ['Early cavity detection', 'Oral cancer screening', 'Gum health assessment', 'Personalized oral hygiene plan'],
  },
  {
    id: 'teeth-cleaning',
    name: 'Teeth Cleaning',
    category: 'Hygiene & Prophylaxis',
    description:
      'Gentle ultrasonic scaling and airflow polishing to eliminate stubborn plaque, tartar, and surface stains while preserving enamel integrity.',
    priceRange: '₹1,200 – ₹2,500',
    duration: '45 mins',
    benefits: ['Removes calculus & stains', 'Prevents gingivitis', 'Freshens breath', 'Polished, smoother tooth surfaces'],
  },
  {
    id: 'root-canal',
    name: 'Root Canal Treatment',
    category: 'Endodontics',
    description:
      'Painless, computer-guided rotary endodontic therapy with digital apex locators and bioceramic sealers, designed for single-visit comfort.',
    priceRange: '₹4,500 – ₹8,500',
    duration: '60 mins',
    benefits: ['Preserves natural tooth structure', 'Zero-pain computerized anesthesia', 'Digitally verified root apex sealing', 'Same-day ceramic crown preparation'],
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    category: 'Alignment & Dentofacial',
    description:
      'Custom orthodontic solutions including invisible clear aligners, ceramic self-ligating braces, and AI-predicted smile progression modeling.',
    priceRange: '₹28,000 – ₹1,20,000',
    duration: 'Multi-month treatment',
    benefits: ['Digital 3D smile preview', 'Virtually invisible aligner trays', 'Bite & speech optimization', 'Comfortable, non-invasive adjustments'],
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    category: 'Aesthetic Restoration',
    description:
      'Advanced aesthetic enhancements including clinic-grade LED laser teeth whitening, handcrafted porcelain veneers, and composite bonding.',
    priceRange: '₹3,500 – ₹18,000 / tooth',
    duration: '45 – 90 mins',
    benefits: ['Up to 8 shades whiter teeth', 'Natural translucency & shading', 'Minimal tooth preparation', 'Long-lasting stain resistance'],
  },
];

export const FooterBanner: React.FC<FooterBannerProps> = ({ onNavigateTab }) => {
  // Modal states for non-destructive, fully functional links
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'services' | 'privacy' | 'terms' | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleServiceClick = (serviceName: string) => {
    const found = SERVICES_DATA.find((s) => s.name.toLowerCase() === serviceName.toLowerCase()) || SERVICES_DATA[0];
    setSelectedService(found);
    setActiveModal('services');
  };

  const handleBookFromService = () => {
    setActiveModal(null);
    setSelectedService(null);
    if (onNavigateTab) {
      onNavigateTab('book-appointment');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickNav = (tab: string) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', phone: '', email: '', message: '' });
      setActiveModal(null);
    }, 2200);
  };

  return (
    <>
      <footer className="w-full bg-white border-t border-slate-200 mt-auto text-slate-800">
        {/* Healthcare Assurance Feature Badges */}
        <div className="border-b border-slate-100 bg-slate-50/60 py-4 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2 text-sky-700">
              <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>Neural Semantic Modeling & Dental Clinical NLP</span>
            </div>
            <div className="flex items-center gap-2 text-teal-700">
              <FileText className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Digital Dental X-Ray & Pathology Analytics</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>NABH & HIPAA Compliant Data Encryption</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <HeartHandshake className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>Verified Dental Specialists (MDS & BDS)</span>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Column 1: Brand & Identity (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <div className="cursor-pointer" onClick={() => handleQuickNav('dashboard')}>
                <ToothLogo size={42} showText={true} />
              </div>

              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wide text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                  Your Smile, Our Priority.
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                OralCare combines patient-first dentistry with intelligent clinical text processing, smart
                prescriptions, and seamless tele-consultations for modern multi-specialty dental care.
              </p>

              {/* Social Media Channels */}
              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                  Connect With Us
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="OralCare on Facebook"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="OralCare on X (formerly Twitter)"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="OralCare on LinkedIn"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-sky-700 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="OralCare on Instagram"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="OralCare on YouTube"
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white text-slate-600 flex items-center justify-center transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-900 border-b border-slate-100 pb-2">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li>
                  <button
                    onClick={() => handleQuickNav('dashboard')}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Home</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>About Us</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setSelectedService(SERVICES_DATA[0]);
                      setActiveModal('services');
                    }}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Services</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleQuickNav('find-doctor')}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Doctors</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleQuickNav('book-appointment')}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Appointments</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-sky-600 hover:translate-x-1 transition-all duration-150 flex items-center gap-1.5 text-left"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Us</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Our Services (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-900 border-b border-slate-100 pb-2">
                Our Services
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {SERVICES_DATA.map((service) => (
                  <li key={service.id}>
                    <button
                      onClick={() => handleServiceClick(service.name)}
                      className="group flex items-center justify-between w-full text-left hover:text-sky-600 transition-colors py-0.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                        <span>{service.name}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-teal-600 bg-slate-50 group-hover:bg-teal-50 px-2 py-0.5 rounded-full border border-slate-100 group-hover:border-teal-100 transition-colors">
                        View
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Information (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-900 border-b border-slate-100 pb-2">
                Contact Information
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 font-semibold mb-0.5">OralCare Dental Hospital</strong>
                    <span>Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033, India</span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 font-medium">Appointments & Enquiries:</span>
                    <a
                      href="tel:+919845012345"
                      className="font-semibold text-slate-800 hover:text-teal-700 transition-colors"
                    >
                      +91 98450 12345
                    </a>
                    <span className="block text-[11px] text-teal-700 font-medium mt-0.5">
                      Emergency: 1800-425-9999 (Toll-Free)
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 font-medium">Official Email:</span>
                    <a
                      href="mailto:care@oralcare.in"
                      className="font-semibold text-slate-800 hover:text-sky-700 transition-colors"
                    >
                      care@oralcare.in
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-800 font-semibold">Consultation Hours:</strong>
                    <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
                    <span className="block text-[11px] text-slate-500">Sunday: 9:00 AM – 1:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links & Project ZIP */}
        <div className="border-t border-slate-100 bg-slate-50/80 py-5 px-6 md:px-12 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="font-normal text-slate-600">
                © 2026 OralCare. All rights reserved.
              </p>
              <span className="hidden sm:inline text-slate-300">•</span>
              <a
                href="/oralcare-dentalnlp-x.zip"
                download="oralcare-dentalnlp-x.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-2xs transition-colors"
                title="Download full project source code ZIP"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>Download Project ZIP</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-sky-700 hover:underline transition-colors font-medium text-slate-600"
              >
                Privacy Policy
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-sky-700 hover:underline transition-colors font-medium text-slate-600"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL: Services Detailed View */}
      {activeModal === 'services' && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                  {selectedService.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedService.name}</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-slate-600">
              <p className="leading-relaxed">{selectedService.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Estimated Fee</span>
                  <span className="text-base font-bold text-slate-900">{selectedService.priceRange}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Session Duration</span>
                  <span className="text-base font-bold text-slate-900">{selectedService.duration}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Treatment Highlights & Care Standards
                </h4>
                <ul className="space-y-1.5">
                  {selectedService.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleBookFromService}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Treatment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: About Us */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <ToothLogo size={36} showText={false} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">About OralCare</h3>
                  <span className="text-xs font-semibold text-sky-600">Your Smile, Our Priority.</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                OralCare is a premier multi-speciality dental healthcare institution established to provide
                holistic, empathetic, and technologically superior oral care. Founded with the mission to eradicate
                preventable dental diseases across India, we unite master clinicians with breakthrough AI-driven clinical
                assistance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center gap-2 text-sky-800 font-bold text-xs mb-1">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>DentalNLP-X Research Engine</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Neural Semantic Modeling for Unstructured Dental Clinical Text, translating handwritten charts,
                    radiographs, and notes into structured records.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>NABH & IDA Accreditations</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Class-B autoclave sterilization, 100% digital apex locators, zero-radiation digital phosphor plate
                    sensors, and hospital-grade hygiene.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Hospital Leadership</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">Dr. Priya Mehta, BDS, MDS</span> — Chief of Clinical Prosthodontics (8+ yrs exp)
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Dr. Rajesh Kumar, BDS, MDS</span> — Head of Orthodontics & Clear Aligners (10+ yrs exp)
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Dr. Anjali Sharma, BDS, MDS</span> — Senior Oral & Maxillofacial Surgeon (6+ yrs exp)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Jubilee Hills, Hyderabad</span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Contact Us */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Contact OralCare Hospital</h3>
                <span className="text-xs text-slate-500">We are here to assist with appointments and oral health emergencies.</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Inquiry Received</h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Our hospital coordination team will call you back within 15 minutes. For immediate emergencies, dial{' '}
                  <strong className="text-slate-900">1800-425-9999</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="py-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 XXXXX"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="care@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message or Query</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your dental concern, preferred doctor, or query..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>Emergency Hotline: <strong>1800-425-9999</strong></span>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                    24/7 Active
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Privacy Policy */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Privacy Policy</h3>
                <span className="text-xs text-slate-500">Effective Date: January 1, 2026 | OralCare Dental Hospital</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">1. Information We Collect</h4>
                <p>
                  OralCare collects patient demographics (name, age, gender, phone number, email), dental clinical records,
                  digital intraoral radiographs, doctor prescriptions, and medical history. This information is strictly utilized
                  to formulate diagnosis and ensure accurate dental treatments.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">2. Clinical NLP & AI Processing Safeguards</h4>
                <p>
                  Text transcribed from voice-to-text notes or processed via the Neural Semantic Modeling system (DentalNLP-X)
                  is de-identified where required. AI outputs serve solely as diagnostic decision support for licensed dental
                  surgeons and do not replace professional medical evaluations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">3. Data Security & Encryption Standards</h4>
                <p>
                  All patient records, medical history, and prescriptions are stored using end-to-end encryption in transit
                  (TLS 1.3) and at rest (AES-256). Role-Based Access Control (RBAC) ensures only authorized dentists and hospital
                  administrators may access patient data.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">4. Patient Rights & Data Portability</h4>
                <p>
                  Under the Digital Personal Data Protection Act (DPDPA) and DISHA guidelines, you have the right to request a
                  digital copy of your prescriptions, consultation notes, and radiographs or request account deactivation at any
                  time via <span className="text-sky-700 font-semibold">care@oralcare.in</span>.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Terms & Conditions */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-xl border border-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Terms & Conditions of Service</h3>
                <span className="text-xs text-slate-500">Effective Date: January 1, 2026 | OralCare Dental Hospital</span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">1. Clinical Consultations & Tele-Dentistry</h4>
                <p>
                  Video consultations facilitated through Google Meet are provided in compliance with the Telemedicine Practice
                  Guidelines issued by the Dental Council of India (DCI). Remote consultations are intended for preliminary
                  evaluation, triage, and follow-ups. Physical procedures require in-clinic appointments.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">2. Appointment Scheduling & Cancellations</h4>
                <p>
                  Patients may reschedule or cancel appointments up to 2 hours prior to the scheduled slot without penalty. For
                  urgent toothache or trauma, walk-ins and our 24/7 emergency hotline (1800-425-9999) take immediate priority.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">3. Prescriptions & Medication Adherence</h4>
                <p>
                  Prescriptions issued by OralCare dental practitioners are valid and verifiable. Automated medicine reminders
                  are provided as an assistive reminder tool; patients must always consult their treating physician or dentist
                  if adverse drug reactions or sensitivities arise.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">4. Payment & Indian Currency</h4>
                <p>
                  All treatment fees, consultation charges, and estimates are quoted in Indian Rupees (₹) including applicable
                  healthcare GST exemptions. Digital payment options include UPI, net banking, and all major cards.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Accept & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
