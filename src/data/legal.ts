// Legal page content. Plain-language drafts: have a lawyer review them before launch.
// Bodies may contain simple HTML (links, lists). They are static and trusted.

export const legalUpdated = 'November 24, 2026';
const email = 'info@luminarymarketingagency.com';
const mail = `<a href="mailto:${email}">${email}</a>`;

export interface LegalSection { id: string; title: string; body: string[] }
export interface LegalDoc { slug: string; title: string; heading: string; eyebrow: string; description: string; intro: string; sections: LegalSection[] }

export const privacy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy | Luminary Marketing',
  heading: 'Privacy Policy',
  eyebrow: 'Legal',
  description: 'How Luminary Marketing Agency collects, uses and protects your information, and the choices you have.',
  intro: 'This policy explains what information Luminary Marketing Agency ("Luminary", "we", "us") collects on this website, how we use it, and what choices you have. We keep it short and plain on purpose.',
  sections: [
    { id: 'who-we-are', title: 'Who we are', body: [
      'Luminary Marketing Agency provides social media, content, advertising, website and sales support services to aesthetic and medical practices. This policy covers this website and any messages you send us through it.',
      `Questions about this policy can go to ${mail}.`,
    ] },
    { id: 'health-information', title: 'Please do not send patient or health information', body: [
      'Our website and forms are not meant for medical or patient information. Do not include health details, patient names or other protected health information in a message to us. If we need to work with information of that kind for a client, we do it under a separate written agreement.',
    ] },
    { id: 'what-we-collect', title: 'Information we collect', body: [
      '<strong>Information you give us.</strong> When you use our contact form or write to us, we collect your name, email address, phone number, practice type and the message you send.',
      '<strong>Information collected automatically.</strong> When you visit, our servers and tools may record your IP address, browser and device type, the pages you view, the page that sent you here, and the date and time. This comes from standard server logs and, only if you allow it, from cookies and similar tools (see section 4).',
      '<strong>Information from other places.</strong> If you contact us through Instagram or another platform, we receive what you send us there, under that platform\'s own rules.',
    ] },
    { id: 'how-we-use', title: 'How we use information', body: [
      '<ul><li>To reply to your message and discuss working together.</li><li>To run, secure and improve this website.</li><li>To understand which pages and content are useful, if you accept analytics cookies.</li><li>To measure and improve our own advertising, if you accept marketing cookies.</li><li>To send you updates you asked for. You can unsubscribe at any time.</li><li>To meet legal duties and protect our rights.</li></ul>',
    ] },
    { id: 'cookies', title: 'Cookies and similar tools', body: [
      'We use a small number of cookies and similar storage. Necessary ones keep the site working. Others are used only if you agree. You can change your choice at any time with the "Cookie settings" link in the footer. Details are in our <a href="/cookies">Cookie Policy</a>.',
    ] },
    { id: 'sharing', title: 'How we share information', body: [
      'We do not sell your personal information for money. We share it only as follows:',
      '<ul><li><strong>Service providers</strong> that help us run the site and our business, such as website hosting, email, scheduling, analytics and customer relationship tools. They may use the information only to provide their service to us.</li><li><strong>Advertising partners</strong>, only if you accept marketing cookies. Sharing for ads may count as "sharing" or "targeted advertising" under some state laws. You can opt out by rejecting marketing cookies.</li><li><strong>Legal and safety reasons</strong>, such as responding to a lawful request or protecting our rights.</li><li><strong>A business change</strong>, such as a merger or sale, where information moves to the new owner under this policy.</li></ul>',
    ] },
    { id: 'your-choices', title: 'Your choices and rights', body: [
      'Depending on where you live, you may have the right to know what personal information we hold about you, to get a copy, to correct it, to delete it, and to opt out of targeted advertising, sale or profiling. You will not be treated unfairly for using these rights.',
      `To make a request, email ${mail} and tell us what you would like. We may need to confirm it is you before we act. If we turn down a request, you can ask us to explain, and you may appeal by replying to our answer.`,
      'You can also reject marketing and analytics cookies in our banner, and turn on the "Global Privacy Control" setting in your browser. We treat that signal as an opt-out of targeted advertising where the law asks us to.',
    ] },
    { id: 'retention', title: 'How long we keep information', body: [
      'We keep contact and enquiry information for as long as we need it to talk with you and to meet legal and accounting duties, then delete or anonymize it. If you ask us to delete it sooner, we will, unless the law requires us to keep it.',
    ] },
    { id: 'security', title: 'Security', body: [
      'We use reasonable technical and organizational steps to protect information, including encrypted connections. No website or storage method is completely secure, so we cannot promise absolute security.',
    ] },
    { id: 'children', title: 'Children', body: [
      'This website is for businesses and is not meant for anyone under 18. We do not knowingly collect information from children. If you think a child has sent us information, tell us and we will delete it.',
    ] },
    { id: 'links', title: 'Links to other sites', body: [
      'Our site links to other sites, such as Instagram and client websites. We do not control them and are not responsible for their privacy practices. Please read their policies.',
    ] },
    { id: 'changes', title: 'Changes to this policy', body: [
      'We may update this policy from time to time. The date at the top shows when it last changed. If the changes are important, we will make that clear on the site.',
    ] },
    { id: 'contact', title: 'Contact us', body: [
      `Luminary Marketing Agency<br />Email: ${mail}<br />Phone: <a href="tel:+12019709070">+1 (201) 970-9070</a>`,
    ] },
  ],
};

export const terms: LegalDoc = {
  slug: 'terms',
  title: 'Terms and Conditions | Luminary Marketing',
  heading: 'Terms and Conditions',
  eyebrow: 'Legal',
  description: 'The terms for using the Luminary Marketing Agency website.',
  intro: 'These terms cover your use of this website. By using it, you agree to them. If you do not agree, please do not use the site.',
  sections: [
    { id: 'about', title: 'About these terms', body: [
      'This website is run by Luminary Marketing Agency ("Luminary", "we", "us"). These terms apply to the website only. Any marketing, content, advertising or website work we do for a client is covered by a separate written agreement, which takes priority if there is a conflict.',
    ] },
    { id: 'use', title: 'Using the website', body: [
      'You may use the site for lawful purposes and in line with these terms. You agree not to:',
      '<ul><li>copy, scrape or resell our content without permission;</li><li>try to break, overload or gain access to parts of the site or its systems you are not meant to reach;</li><li>send harmful code, spam or false information through our forms;</li><li>use the site in a way that breaks any law or the rights of others.</li></ul>',
    ] },
    { id: 'no-health', title: 'No patient or health information', body: [
      'Do not send patient, medical or other protected health information through this website. See our <a href="/privacy">Privacy Policy</a>.',
    ] },
    { id: 'ip', title: 'Our content and trademarks', body: [
      'The text, design, logos, images, videos and other material on this site belong to Luminary or its licensors and are protected by copyright and other laws. Client names, logos and website screenshots belong to their owners and are shown with permission. You may view and share links to the site, but you may not copy or reuse our material without our written permission.',
    ] },
    { id: 'your-content', title: 'What you send us', body: [
      'If you send us a message, ideas or feedback, you allow us to use it to respond to you and to improve our services. We will handle personal information as set out in our Privacy Policy.',
    ] },
    { id: 'no-guarantee', title: 'No guarantee of results', body: [
      'The site describes services and example outcomes in general terms. Marketing results depend on many things outside our control, such as your market, budget, offers and team. We do not promise any specific number of leads, patients, bookings or revenue. See our <a href="/disclaimer">Disclaimer</a>.',
    ] },
    { id: 'warranties', title: 'Site provided "as is"', body: [
      'We work to keep the site accurate and available, but we provide it "as is" and "as available", without promises of any kind to the extent the law allows. We do not promise the site will be free of errors or interruptions.',
    ] },
    { id: 'liability', title: 'Limit of liability', body: [
      'To the extent the law allows, Luminary and its owners and team are not liable for indirect, incidental, special or consequential losses, or for lost profits or data, from your use of the website. Nothing in these terms limits liability that cannot be limited by law.',
    ] },
    { id: 'links', title: 'Third-party links', body: [
      'The site may link to websites we do not run. We are not responsible for their content or practices, and a link is not an endorsement.',
    ] },
    { id: 'law', title: 'Governing law', body: [
      'These terms are governed by the laws of the State of New Jersey, without regard to its conflict of laws rules. Any dispute about the website will be handled in the state or federal courts located in New Jersey, and you agree to their authority.',
    ] },
    { id: 'changes', title: 'Changes', body: [
      'We may change these terms from time to time. The date at the top shows the latest version. If you keep using the site after a change, you accept the new terms.',
    ] },
    { id: 'contact', title: 'Contact us', body: [
      `Questions about these terms: ${mail}.`,
    ] },
  ],
};

export const cookies: LegalDoc = {
  slug: 'cookies',
  title: 'Cookie Policy | Luminary Marketing',
  heading: 'Cookie Policy',
  eyebrow: 'Legal',
  description: 'What cookies and similar storage the Luminary Marketing Agency website uses, and how to change your choices.',
  intro: 'This page explains the cookies and similar storage this website uses and how you can control them.',
  sections: [
    { id: 'what', title: 'What cookies are', body: [
      'Cookies are small files that a website stores in your browser. Similar tools, such as local storage, work in much the same way. We call all of them "cookies" here.',
    ] },
    { id: 'types', title: 'The types we use', body: [
      '<ul><li><strong>Necessary.</strong> Keep the site working and remember your cookie choice. These are always on.</li><li><strong>Preferences.</strong> Remember settings you choose, so you do not have to repeat them. Off until you agree.</li><li><strong>Analytics.</strong> Help us understand which pages are visited and how the site performs, in combined form. Off until you agree.</li><li><strong>Marketing.</strong> Help us measure our advertising and show relevant ads on other sites. Off until you agree.</li></ul>',
    ] },
    { id: 'list', title: 'What is stored today', body: [
      '<table><thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Lasts</th></tr></thead><tbody><tr><td><code>lm-consent</code></td><td>Necessary</td><td>Remembers your cookie choices.</td><td>Until you clear your browser data</td></tr><tr><td><code>lm-loaded</code></td><td>Necessary</td><td>Stops the welcome animation from repeating during a visit.</td><td>This visit (session)</td></tr></tbody></table>',
      'If we turn on analytics or advertising tools, they will load only after you agree, and we will add them to this list.',
    ] },
    { id: 'choices', title: 'Your choices', body: [
      'When you first visit, our banner lets you accept all, reject all, or customize. You can change your mind at any time using the "Cookie settings" link in the footer of every page.',
      'You can also block or delete cookies in your browser settings. If you block necessary cookies, parts of the site may not work as expected. We also respect the "Global Privacy Control" signal where the law requires it.',
    ] },
    { id: 'third', title: 'Third-party cookies', body: [
      'Some tools we may use, such as analytics or advertising services, set their own cookies. Their use is covered by their own policies. We load them only if you accept the matching category.',
    ] },
    { id: 'more', title: 'More information', body: [
      `Read our <a href="/privacy">Privacy Policy</a> or write to ${mail}.`,
    ] },
  ],
};

export const disclaimer: LegalDoc = {
  slug: 'disclaimer',
  title: 'Disclaimer | Luminary Marketing',
  heading: 'Disclaimer',
  eyebrow: 'Legal',
  description: 'Important notes about results, examples, medical content and compliance on the Luminary Marketing Agency website.',
  intro: 'Please read these notes about the information on this site.',
  sections: [
    { id: 'general', title: 'General information only', body: [
      'The content on this website is for general information about our marketing services. It is not legal, medical, tax or financial advice.',
    ] },
    { id: 'results', title: 'Results vary', body: [
      'Examples, case studies and client work on this site show what was possible for a specific client at a specific time. They are not a promise of what your practice will get. Results depend on your market, services, budget, team, offers and many other factors.',
    ] },
    { id: 'medical', title: 'Not medical advice', body: [
      'We are a marketing agency, not a medical provider. Nothing on this site is medical advice, and no content here creates a doctor and patient relationship. Procedures and treatments shown in client examples belong to those clients.',
    ] },
    { id: 'compliance', title: 'Advertising rules are your responsibility', body: [
      'Medical and aesthetic advertising is regulated, for example by the Federal Trade Commission, state medical boards and platform ad policies. We follow those rules in our work and flag concerns we see, but each practice remains responsible for the claims, before and after images, testimonials and licensing details it publishes. Please review rules that apply to you, and ask your own legal adviser when needed.',
    ] },
    { id: 'clients', title: 'Client names and images', body: [
      'Client names, logos and website images appear with permission and belong to their owners. Their appearance does not mean they endorse every statement on this site.',
    ] },
    { id: 'platforms', title: 'Social platforms', body: [
      'Instagram, Facebook, TikTok and Meta are trademarks of their owners. Luminary is not affiliated with, sponsored by or endorsed by those companies.',
    ] },
    { id: 'links', title: 'External links', body: [
      'We link to other websites for your convenience. We do not control them and do not guarantee their accuracy.',
    ] },
    { id: 'contact', title: 'Questions', body: [
      `If something on this site looks wrong or out of date, please tell us at ${mail}.`,
    ] },
  ],
};

export const accessibility: LegalDoc = {
  slug: 'accessibility',
  title: 'Accessibility Statement | Luminary Marketing',
  heading: 'Accessibility Statement',
  eyebrow: 'Legal',
  description: 'How Luminary Marketing Agency works to make its website usable for everyone, and how to report a problem.',
  intro: 'We want everyone to be able to use this website, including people who use assistive technology.',
  sections: [
    { id: 'commitment', title: 'Our commitment', body: [
      'We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. We review the site as we update it and fix problems we find.',
    ] },
    { id: 'features', title: 'What we do', body: [
      '<ul><li>Pages use a clear heading order and landmark regions.</li><li>Images that carry meaning have text descriptions.</li><li>All links, buttons and form fields can be used with a keyboard and show a visible focus.</li><li>Text and controls are designed for strong color contrast.</li><li>Motion and animation are reduced if your device is set to reduce motion.</li><li>The layout adapts to phones, tablets and larger screens, and text can be enlarged.</li></ul>',
    ] },
    { id: 'limits', title: 'Known limits', body: [
      'Some older content or content from other providers, such as embedded social posts, may not meet every guideline yet. We are working to improve it.',
    ] },
    { id: 'feedback', title: 'Tell us about a problem', body: [
      `If you have trouble using any part of this site, or need information in another format, email ${mail} or call <a href="tel:+12019709070">+1 (201) 970-9070</a>. Tell us the page address and the problem you had. We try to reply within two business days.`,
    ] },
    { id: 'updated', title: 'About this statement', body: [
      'This statement was last updated on the date shown above.',
    ] },
  ],
};

export const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Disclaimer', href: '/disclaimer' },
  { label: 'Accessibility', href: '/accessibility' },
];
