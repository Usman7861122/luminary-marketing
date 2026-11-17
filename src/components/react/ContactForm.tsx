import { useState } from 'react';

const field =
  'w-full rounded-[12px] border border-ivory/15 bg-obsidian/60 px-5 py-4 text-[0.95rem] font-light text-ivory placeholder:text-ivory/40 transition-colors focus:border-champagne focus:outline-none';
const label = 'mb-2 block text-[0.68rem] uppercase tracking-[0.22em] text-ivory/60';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      // TODO: point this at your form service (Formspree, Resend, or an Astro API route).
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? 'done' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-[14px] border border-champagne/40 p-10" role="status">
        <p className="font-display text-3xl font-light text-ivory">Message sent.</p>
        <p className="lead mt-3">We will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label className={label} htmlFor="name">Full name</label><input id="name" name="name" required autoComplete="name" className={field} placeholder="Dr. Jane Smith" /></div>
        <div><label className={label} htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@practice.com" /></div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label className={label} htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="(555) 000-0000" /></div>
        <div>
          <label className={label} htmlFor="type">Practice type</label>
          <select id="type" name="type" className={field} defaultValue="">
            <option value="" disabled>Select one</option>
            <option>Plastic surgery</option><option>Med spa</option><option>Dermatology</option><option>Dental</option><option>Other</option>
          </select>
        </div>
      </div>
      <div><label className={label} htmlFor="message">How can we help?</label><textarea id="message" name="message" required rows={5} className={field} placeholder="Tell us about your practice and your goals" /></div>

      <div className="flex flex-wrap items-center gap-6">
        <button type="submit" disabled={status === 'sending'} className="btn-lux disabled:opacity-60">
          {status === 'sending' ? 'Sending...' : 'Send message'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
        {status === 'error' && <p role="alert" className="text-sm text-[#e7a3a3]">Your message did not send. Check your connection and try again.</p>}
      </div>
    </form>
  );
}
