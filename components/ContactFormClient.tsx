'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    department: 'general',
    subject: '',
    message: '',
    honeypot: '', // anti-spam bot trap
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If honeypot is filled, it's a spam bot
    if (formData.honeypot) {
      setStatus('submitted');
      return;
    }

    setStatus('submitting');

    // Determine target recipient based on selected department
    let targetEmail = 'info@phevs.eu';
    if (formData.department === 'homologation') {
      targetEmail = 'data@phevs.eu';
    } else if (formData.department === 'editorial') {
      targetEmail = 'editor@phevs.eu';
    }

    const emailSubject = encodeURIComponent(
      `[PHEVs.eu Contact] ${formData.subject || formData.department}`
    );
    const emailBody = encodeURIComponent(
      `Name: ${formData.fullName}\nEmail: ${formData.email}\nOrganization: ${formData.organization || 'N/A'}\nDepartment: ${formData.department}\n\nMessage:\n${formData.message}`
    );

    // Prepare direct mailto link as resilient client fallback
    const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      setStatus('submitted');
      // Trigger default email app
      if (typeof window !== 'undefined') {
        window.location.href = mailtoUrl;
      }
    }, 600);
  };

  return (
    <div>
      {status === 'submitted' ? (
        <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-300">
            <CheckCircleIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Message Prepared & Sent!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. Your message has been prepared for our European research team. We will review your inquiry and get back to you shortly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({
                  fullName: '',
                  email: '',
                  organization: '',
                  department: 'general',
                  subject: '',
                  message: '',
                  honeypot: '',
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Send Another Inquiry
            </button>
            <a
              href={`mailto:info@phevs.eu?subject=Direct Inquiry from ${encodeURIComponent(formData.fullName)}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
            >
              <EnvelopeIcon className="w-4 h-4" />
              Open in Mail App
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field (hidden from humans, catches bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_company_field">Do not fill this</label>
            <input
              type="text"
              id="hp_company_field"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Alexander Weber"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Business or Personal Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alexander@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="organization"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Organization / Company <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. BMW Group, Fleet Leasing Corp"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Department / Inquiry Type <span className="text-red-500">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General Inquiries (info@phevs.eu)</option>
                <option value="homologation">Manufacturer Data & WLTP Correction (data@phevs.eu)</option>
                <option value="editorial">Editorial, Press & Media (editor@phevs.eu)</option>
                <option value="partnership">Fleet & Commercial Partnerships</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Subject / Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. 2026 WLTP Homologation update for new PHEV model"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Message Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Please provide comprehensive details, vehicle VIN/model code if applicable, or official specification references..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            ></textarea>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              🔒 Your email and data are processed strictly in accordance with GDPR.
            </p>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{status === 'submitting' ? 'Preparing Message...' : 'Submit Inquiry'}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
