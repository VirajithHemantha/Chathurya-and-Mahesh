import React, { useState } from 'react';
import { Copy, Link as LinkIcon, Check, MessageSquare, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const PREFIX_OPTIONS = [
  'Mr.',
  'Mrs.',
  'Miss',
  'Mr. & Mrs.',
  'Family',
  'Dear'
];

const GROOM_NAME = 'Mahesh';
const BRIDE_NAME = 'Chathurya';

export function AdminPage() {
  const [prefix, setPrefix] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedDisplayName, setGeneratedDisplayName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // Intelligently combine prefix and guest name
  const computeDisplayName = (p: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return '';

    if (p === 'Family') {
      return `${trimmed} and Family`;
    }
    if (p === 'Dear') {
      return trimmed;
    }
    return `${p} ${trimmed}`;
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Please enter a guest name');
      return;
    }

    const displayName = computeDisplayName(prefix, guestName);
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/${encodeURIComponent(displayName)}`;

    setGeneratedDisplayName(displayName);
    setGeneratedLink(link);
    setCopiedLink(false);
    setCopiedMessage(false);
    toast.success('Link and invitation message generated!');
  };

  const buildFullMessage = (displayName: string, link: string) => {
    return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
  };

  const handleCopyLinkOnly = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopiedLink(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyFullMessage = async () => {
    if (!generatedLink || !generatedDisplayName) return;
    const message = buildFullMessage(generatedDisplayName, generatedLink);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessage(true);
      toast.success('Full WhatsApp message copied!');
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (err) {
      toast.error('Failed to copy message');
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800 flex flex-col items-center justify-center relative">
      <Toaster position="top-center" richColors />

      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-4xl h-[80%] bg-gradient-radial from-brand-beige/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(176,137,104,0.15)] border border-brand-beige/40 overflow-hidden relative z-10">
        
        {/* Header Banner */}
        <div className="p-8 sm:p-10 border-b border-brand-beige/20 text-center bg-gradient-to-b from-white to-brand-ivory/50">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-champagne rounded-full border border-brand-beige/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-beige-deep">Admin Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display text-stone-800 mb-2">
            Wedding Invitation Link Generator
          </h1>
          <p className="text-stone-500 font-serif text-sm sm:text-base">
            Create personalized links & WhatsApp messages for {BRIDE_NAME} & {GROOM_NAME}'s Wedding
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 sm:p-10 space-y-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Prefix Selector */}
              <div className="sm:col-span-1">
                <label htmlFor="prefix" className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-600 mb-2">
                  Select Prefix
                </label>
                <select
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-beige-deep/50 shadow-sm transition-all"
                >
                  {PREFIX_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Name Input */}
              <div className="sm:col-span-2">
                <label htmlFor="guestName" className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-600 mb-2">
                  Guest Name
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sanjaya"
                  className="w-full px-4 py-3 rounded-xl border border-brand-beige bg-white text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-beige-deep/50 shadow-sm transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Quick Live Preview of Display Name */}
            {guestName.trim() && (
              <div className="p-3 bg-brand-ivory/60 rounded-xl border border-brand-beige/30 flex items-center justify-between text-xs text-stone-600">
                <span>Display Name Preview:</span>
                <span className="font-bold text-brand-beige-deep">
                  {computeDisplayName(prefix, guestName)}
                </span>
              </div>
            )}

            {/* Primary Generate Button */}
            <button
              type="submit"
              disabled={!guestName.trim()}
              className="w-full py-4 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 text-white font-sans text-xs sm:text-sm tracking-[0.25em] uppercase font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-stone-700 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              <span>Generate Link</span>
            </button>
          </form>

          {/* Generated Result & Preview Area */}
          {generatedLink && (
            <div className="pt-6 border-t border-brand-beige/30 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
              
              {/* Generated URL Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-stone-600">
                    Generated Link
                  </label>
                  <a
                    href={generatedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-beige-deep hover:underline"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="flex items-center gap-2 p-3 bg-brand-ivory rounded-xl border border-brand-beige/50">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-transparent text-xs sm:text-sm text-stone-700 font-mono focus:outline-none select-all"
                  />
                </div>
              </div>

              {/* Message Preview Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-stone-600 mb-2">
                  WhatsApp Message Preview
                </label>
                <div className="p-5 bg-stone-50 rounded-2xl border border-brand-beige/30 text-stone-700 font-serif text-sm leading-relaxed whitespace-pre-wrap select-text shadow-inner">
                  {buildFullMessage(generatedDisplayName, generatedLink)}
                </div>
              </div>

              {/* Action Copy Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleCopyLinkOnly}
                  className="w-full py-3.5 px-4 bg-white border border-brand-beige text-brand-beige-deep font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-xl shadow-sm hover:bg-brand-ivory transition-all flex items-center justify-center gap-2"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link Only</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCopyFullMessage}
                  className="w-full py-3.5 px-4 bg-brand-beige-deep text-white font-sans text-xs tracking-[0.2em] uppercase font-bold rounded-xl shadow-md hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Copy Full Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-brand-ivory/40 border-t border-brand-beige/20 text-center text-xs text-stone-400">
          Chathurya &amp; Mahesh Wedding • December 03, 2026
        </div>
      </div>
    </div>
  );
}
