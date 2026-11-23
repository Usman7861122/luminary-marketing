export const site = {
  name: 'Luminary Marketing',
  tagline: 'Marketing that makes your practice unforgettable.',
  description:
    'Luminary Marketing Agency builds social media, content, ads and websites for aesthetic and medical practices that want a premium digital presence that converts.',
  phone: '+1 (201) 970-9070',
  phoneHref: 'tel:+12019709070',
  email: 'info@luminarymarketingagency.com',
  instagram: 'luminarymarketingnewjersey',
  instagramUrl: 'https://www.instagram.com/luminarymarketingnewjersey/',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'The Luminary Difference', href: '/difference' },
    { label: 'Contact', href: '/#contact' },
  ],
};

export const services = [
  { title: 'Social media management', image: '/images/services/social.webp', pos: '50% 30%', text: 'Planning, posting and community care for your Instagram, TikTok and Facebook, so your feed always looks like your practice at its best.', href: '/services' },
  { title: 'Content and reels', image: '/images/services/content.webp', pos: '50% 30%', text: 'Short videos, photo shoots and captions made for aesthetic practices. You stop designing graphics. We handle it all.', href: '/services' },
  { title: 'Paid advertising', image: '/images/services/ads.webp', pos: '50% 50%', text: 'Meta and Google campaigns aimed at people who are ready to book a consultation, with clear reporting on every dollar.', href: '/services' },
  { title: 'Local SEO', image: '/images/services/seo.webp', pos: '68% 50%', text: 'Show up first when patients search for your procedures in your city, with a Google profile that earns trust.', href: '/services' },
  { title: 'Website design', image: '/images/services/web.webp', pos: '50% 40%', text: 'Fast, elegant websites with booking built in, designed to feel as premium as your treatment rooms.', href: '/services' },
  { title: 'Brand strategy', image: '/images/services/brand.webp', pos: '62% 30%', text: 'A clear voice, look and message that make your practice the obvious choice in your market.', href: '/services' },
];

// PLACEHOLDER project names. Replace with real client work.
export const projects = [
  { slug: 'surgery-launch', title: 'Plastic surgery launch', tag: 'Campaign', image: '/images/stock/clinic-hallway.webp', span: 'lg:col-span-7', ratio: 'aspect-[16/10]' },
  { slug: 'medspa-social', title: 'Med spa social growth', tag: 'Social media', image: '/images/stock/portrait-black-dress.webp', span: 'lg:col-span-5', ratio: 'aspect-[16/10] lg:aspect-auto' },
  { slug: 'clinic-rebrand', title: 'Clinic rebrand', tag: 'Branding', image: '/images/stock/clinic-reception.webp', span: 'lg:col-span-4', ratio: 'aspect-[4/3]' },
  { slug: 'injectables-ads', title: 'Injectables ad campaign', tag: 'Paid ads', image: '/images/stock/portrait-glamour.webp', span: 'lg:col-span-4', ratio: 'aspect-[4/3]' },
  { slug: 'derm-seo', title: 'Dermatology local SEO', tag: 'SEO', image: '/images/stock/clinic-white.webp', span: 'lg:col-span-4', ratio: 'aspect-[4/3]' },
];

// PLACEHOLDER numbers. Replace with real figures.
export const metrics = [
  { value: 8, suffix: '+', label: 'Years in business' },
  { value: 5, decimals: 1, label: 'Google review rating' },
  { value: 120, suffix: '+', label: 'Practices served' },
  { value: 3.2, decimals: 1, suffix: 'x', label: 'Average growth in inquiries' },
  { value: 92, suffix: '%', label: 'Client retention' },
  { value: 24, suffix: ' hrs', label: 'Average reply time' },
];

// Real posts from the agency's Instagram grid (saved as images in /public/images/ig/).
export const instagramTiles = [
  { src: '/images/ig/ig-1.webp', alt: '"You look like my next client" post' },
  { src: '/images/ig/ig-2.webp', alt: '"Branding is why, marketing is how" post' },
  { src: '/images/ig/ig-3.webp', alt: '"Social media metrics that matter" post' },
  { src: '/images/ig/ig-4.webp', alt: '"Behind the scenes" video cover' },
  { src: '/images/ig/ig-5.webp', alt: '"Paying a monthly retainer for social, PR and content is expensive" post' },
  { src: '/images/ig/ig-6.webp', alt: '"Social media branding" post' },
];

// PLACEHOLDER posts. Replace with real articles.
export const posts = [
  { slug: 'fill-your-consult-calendar', category: 'Strategy', title: 'How to fill your consultation calendar without discounting', date: 'Nov 2026', read: '6 min read', image: '/images/stock/doctor-consult.webp' },
  { slug: 'reels-for-surgeons', category: 'Social media', title: 'What plastic surgeons should post on Instagram Reels', date: 'Oct 2026', read: '5 min read', image: '/images/stock/creator-studio.webp' },
  { slug: 'med-spa-local-seo', category: 'SEO', title: 'A local SEO checklist for med spas', date: 'Oct 2026', read: '7 min read', image: '/images/stock/clinic-white.webp' },
];


// Real client sites. One tablet and one phone screenshot each, in /public/images/work/.
export const showcase = [
  { slug: 'honetderm', name: 'Honet Dermatology', kind: 'Medical and cosmetic dermatology', place: 'Bloomfield Hills, MI', url: 'https://honetderm.com/',
    tablet: '/images/work/honetderm-tablet.webp', phone: '/images/work/honetderm-phone.webp' },
  { slug: 'advspine', name: 'Advanced Spine and Pain', kind: 'Interventional pain care', place: 'The Woodlands, TX', url: 'https://www.advspine.org/',
    tablet: '/images/work/advspine-tablet.webp', phone: '/images/work/advspine-phone.webp' },
];
