// Page content for each service category. Written for review; edit freely.
export type ServiceDetail = { hero: string; hpos: string; p1: [string,string]; p2: [string,string]; lede: string; intro: string[]; bestFor: string[]; signs: string[]; benefits: [string,string][]; steps: [string,string][]; faqs: [string,string][] };
export const serviceDetails: Record<string, ServiceDetail> = {
  "exec-strategy": {
    "hero": "/images/stock/clinic-hallway.webp",
    "hpos": "50% 50%",
    "p1": [
      "/images/stock/portrait-calm.webp",
      "70% 35%"
    ],
    "p2": [
      "/images/stock/clinic-reception.webp",
      "50% 50%"
    ],
    "lede": "Senior sales and marketing leadership for your practice, without the cost of a full-time director.",
    "intro": [
      "Many practices have talented providers and a strong reputation, but nobody steering marketing, sales and daily operations in the same direction. Executive strategy gives you a senior leader on call, built on 19 years in medical aesthetics.",
      "We start by learning your goals, services, team and market. Then we build a plan that ties every marketing effort to consultations, treatment demand and patient conversion."
    ],
    "bestFor": [
      "Practice owners who want a clear growth plan",
      "Practices launching a new service, device or treatment",
      "Teams spending on marketing without clear results",
      "Practices that rely mostly on referrals"
    ],
    "signs": [
      "Leads come in, but few become consultations",
      "Marketing, front desk and sales do not follow one plan",
      "You are unsure how you compare to local competitors",
      "You need a director but cannot justify a full-time hire"
    ],
    "benefits": [
      [
        "Senior guidance, flexible cost",
        "Executive oversight without the salary of a full-time director."
      ],
      [
        "One plan, every team",
        "Marketing, sales and operations working toward the same goals."
      ],
      [
        "Decisions backed by research",
        "Competitor and market analysis behind every priority."
      ],
      [
        "Clear accountability",
        "Measurable targets and regular reviews that keep everyone on track."
      ]
    ],
    "steps": [
      [
        "Discover",
        "We learn your goals, services, staffing and current numbers."
      ],
      [
        "Analyze",
        "We review your market, competitors and the path from inquiry to conversion."
      ],
      [
        "Plan",
        "We set priorities, targets and a clear roadmap your team can follow."
      ],
      [
        "Lead",
        "We guide the work, review results with you and adjust as the practice grows."
      ]
    ],
    "faqs": [
      [
        "What is a fractional director of sales and marketing?",
        "A senior leader who works with your practice part-time. You get the oversight and strategy of an in-house director, without a full-time hire."
      ],
      [
        "How is this different from a regular marketing agency?",
        "An agency usually delivers content and ads. We also look at sales, staff performance and operations, so leads actually become booked patients."
      ],
      [
        "Can you work with our current team and vendors?",
        "Yes. We guide and coordinate the people and partners you already have, and recommend changes only where they help."
      ]
    ]
  },
  "sales": {
    "hero": "/images/stock/doctor-consult.webp",
    "hpos": "40% 40%",
    "p1": [
      "/images/stock/clinic-stairs.webp",
      "50% 50%"
    ],
    "p2": [
      "/images/stock/consult-aesthetic.webp",
      "55% 30%"
    ],
    "lede": "Train your team to handle inquiries, book consultations and convert them into patients.",
    "intro": [
      "A great ad is wasted if the phone call that follows goes badly. Sales development focuses on the people and processes between an inquiry and a booked, attended and accepted consultation.",
      "We train your front desk and patient coordinators, test how your practice handles real inquiries, and build the follow-up systems that stop good leads from slipping away."
    ],
    "bestFor": [
      "Practices with a busy front desk and phones",
      "Teams that book consultations but see many no-shows",
      "Practices hiring new coordinators",
      "Owners who want measurable sales accountability"
    ],
    "signs": [
      "Inquiries are slow to get a reply",
      "Callers are not asked to book",
      "Follow-up is inconsistent or has no owner",
      "Nobody tracks how many leads become consultations"
    ],
    "benefits": [
      [
        "Confident patient conversations",
        "Staff learn to communicate value and handle objections."
      ],
      [
        "Faster, better responses",
        "Clear speed-to-lead rules across phone, text, email and social."
      ],
      [
        "Insight from real calls",
        "Mystery patient assessments show exactly where opportunities are lost."
      ],
      [
        "A team held to clear goals",
        "Simple targets for response time, bookings, attendance and conversion."
      ]
    ],
    "steps": [
      [
        "Assess",
        "We review your calls, inquiries and follow-up as a prospective patient would experience them."
      ],
      [
        "Train",
        "We coach your team on phone skills, consultations and objection handling."
      ],
      [
        "Systemize",
        "We set up lead tracking, CRM stages and follow-up sequences."
      ],
      [
        "Review",
        "We track results, coach on gaps and keep standards high."
      ]
    ],
    "faqs": [
      [
        "What is a mystery patient or ghost caller assessment?",
        "We contact your practice as a prospective patient and record how the inquiry is handled, then share what to keep and what to fix."
      ],
      [
        "Who needs the training?",
        "Anyone who speaks with patients before treatment, usually the front desk, patient coordinators and consultation staff."
      ],
      [
        "Do you help with hiring?",
        "Yes. We can help identify, screen and onboard the people responsible for patient communication and sales."
      ]
    ]
  },
  "social": {
    "hero": "/images/stock/creator-studio.webp",
    "hpos": "50% 40%",
    "p1": [
      "/images/services/social.webp",
      "55% 30%"
    ],
    "p2": [
      "/images/creatives/bts-flatlay.webp",
      "50% 45%"
    ],
    "lede": "Strategy, filming, editing and posting that make your practice look as premium as it is.",
    "intro": [
      "Your social media is often the first place a patient meets your practice. We plan, film and publish content that builds trust in your providers and shows the results of your work.",
      "From on-site filming days to monthly calendars and platform-ready edits, we handle the full process so you can approve content instead of creating it."
    ],
    "bestFor": [
      "Providers who want to be known and trusted online",
      "Practices with no time to create content",
      "Practices that want a consistent, premium look",
      "Teams launching a new treatment or device"
    ],
    "signs": [
      "Your feed is inconsistent or has gone quiet",
      "You post but do not see inquiries",
      "Content does not reflect the quality of your care",
      "You have no plan for video or reels"
    ],
    "benefits": [
      [
        "A consistent, premium feed",
        "One look and voice across Instagram, Facebook, TikTok and YouTube."
      ],
      [
        "Content made for you",
        "Filming, editing, captions and posting handled by one team."
      ],
      [
        "Providers as the brand",
        "Personal branding that builds trust and authority."
      ],
      [
        "Planned around your priorities",
        "Monthly calendars tied to treatments, seasons and business goals."
      ]
    ],
    "steps": [
      [
        "Plan",
        "We build a monthly content calendar around your treatments and goals."
      ],
      [
        "Film",
        "We film on site with providers, staff, technology and patients."
      ],
      [
        "Edit",
        "We create platform-ready reels, shorts and posts with strong copy."
      ],
      [
        "Publish and grow",
        "We publish, engage with your audience and refine what works."
      ]
    ],
    "faqs": [
      [
        "Do you film at our practice?",
        "Yes. Regular on-site sessions capture providers, procedures, technology, testimonials and practice culture."
      ],
      [
        "Can you show before-and-after results?",
        "Yes, with proper patient consent and attention to advertising guidelines."
      ],
      [
        "Which platforms do you manage?",
        "Instagram, Facebook, TikTok and YouTube, including Reels and Shorts."
      ]
    ]
  },
  "ads": {
    "hero": "/images/services/ads.webp",
    "hpos": "50% 50%",
    "p1": [
      "/images/services/seo.webp",
      "55% 50%"
    ],
    "p2": [
      "/images/stock/brand-visibility.webp",
      "50% 30%"
    ],
    "lede": "Meta and Google campaigns built to bring in qualified patient inquiries.",
    "intro": [
      "Paid advertising works when the right message reaches people who are ready to book, and lands on a page that makes it easy to act. We manage the whole path from ad to inquiry.",
      "Every campaign is tracked from lead volume to cost per lead, lead quality, consultations and conversions, so you see what your budget is doing."
    ],
    "bestFor": [
      "Practices ready to scale patient acquisition",
      "Surgical, aesthetic and wellness campaigns",
      "Practices with weak landing pages or forms",
      "Owners who want clear reporting on ad spend"
    ],
    "signs": [
      "Ads bring clicks but few real inquiries",
      "You cannot see cost per lead or consultation",
      "Landing pages are slow or confusing",
      "Creative has not been tested in a long time"
    ],
    "benefits": [
      [
        "Reach people ready to book",
        "Search and social campaigns aimed at real patient demand."
      ],
      [
        "Creative that stands out",
        "Custom video, static designs and copy, tested over time."
      ],
      [
        "Pages built to convert",
        "Landing pages and forms that make booking simple."
      ],
      [
        "Reporting you can read",
        "Lead volume, cost, quality and conversions in one view."
      ]
    ],
    "steps": [
      [
        "Target",
        "We define the procedures, audiences and goals for each campaign."
      ],
      [
        "Create",
        "We produce ad creative, messaging and landing pages."
      ],
      [
        "Launch",
        "We run Meta and Google campaigns and watch performance closely."
      ],
      [
        "Optimize",
        "We adjust messaging, targeting and budget based on results."
      ]
    ],
    "faqs": [
      [
        "Which ad platforms do you manage?",
        "Meta (Facebook and Instagram) and Google Ads."
      ],
      [
        "Do you create the ads too?",
        "Yes. We develop video ads, static designs and written messaging, and test variations."
      ],
      [
        "How do I know if the ads are working?",
        "We report on lead volume, cost per lead, lead quality, consultations and conversions, not just clicks."
      ]
    ]
  },
  "device": {
    "hero": "/images/stock/consult-aesthetic.webp",
    "hpos": "55% 30%",
    "p1": [
      "/images/services/content.webp",
      "50% 35%"
    ],
    "p2": [
      "/images/stock/clinic-white.webp",
      "50% 50%"
    ],
    "lede": "Launch new devices, treatments and procedures with messaging that fills your schedule.",
    "intro": [
      "New technology only pays off when patients know about it and understand its value. We bring firsthand medical device sales knowledge to launches and treatment campaigns.",
      "We position each treatment clearly, prepare your team and create the content and campaigns that introduce it to existing and new patients."
    ],
    "bestFor": [
      "Practices adding a new device or technology",
      "Surgical and nonsurgical treatment campaigns",
      "Providers promoting skin, injectable or wellness services",
      "Practices working with manufacturers on promotions"
    ],
    "signs": [
      "A new device is not getting booked",
      "Patients do not understand a treatment",
      "Your team is unsure how to explain it",
      "Promotions feel generic"
    ],
    "benefits": [
      [
        "Launches with a plan",
        "Campaigns, staff preparation and content ready on day one."
      ],
      [
        "Clear treatment messaging",
        "Benefits, ideal candidates and provider expertise explained well."
      ],
      [
        "Device sales insight",
        "Experience on both the manufacturer and practice side."
      ],
      [
        "Support for partnerships",
        "Help with vendor relationships and promotional opportunities."
      ]
    ],
    "steps": [
      [
        "Position",
        "We define who the treatment is for and how to describe its value."
      ],
      [
        "Prepare",
        "We brief providers and staff so everyone speaks with confidence."
      ],
      [
        "Launch",
        "We roll out content, ads and promotions across channels."
      ],
      [
        "Sustain",
        "We track bookings and keep the treatment in front of patients."
      ]
    ],
    "faqs": [
      [
        "Can you help launch a specific device?",
        "Yes. We build a custom launch plan covering messaging, content, promotions and staff preparation."
      ],
      [
        "Do you work with manufacturers?",
        "We can support relevant brand collaborations, vendor relationships and promotional opportunities."
      ],
      [
        "Is this only for new technology?",
        "No. We also build focused campaigns for existing surgical, nonsurgical, injectable, skin and wellness services."
      ]
    ]
  },
  "brand": {
    "hero": "/images/services/web.webp",
    "hpos": "50% 50%",
    "p1": [
      "/images/stock/portrait-black-dress.webp",
      "45% 30%"
    ],
    "p2": [
      "/images/services/brand.webp",
      "60% 40%"
    ],
    "lede": "A clear brand, a high-converting website and a strong local presence working together.",
    "intro": [
      "Patients judge your practice online long before they walk in. We shape a brand, website and local presence that look and sound like the care you deliver.",
      "From your identity and Google Business Profile to reviews, email and SMS, every touchpoint supports one clear message."
    ],
    "bestFor": [
      "Practices refreshing or launching a brand",
      "Practices with an outdated or slow website",
      "Practices that want more local search visibility",
      "Teams building a patient email and SMS program"
    ],
    "signs": [
      "Your brand looks different in every place",
      "Your website does not convert visitors",
      "Reviews and local listings are neglected",
      "Past patients never hear from you"
    ],
    "benefits": [
      [
        "A recognizable brand",
        "Voice, visuals and positioning that stand out in your market."
      ],
      [
        "A website that converts",
        "Design, content and updates focused on inquiries and bookings."
      ],
      [
        "Stronger local presence",
        "Optimized Google Business Profile and reputation support."
      ],
      [
        "Ongoing patient contact",
        "Email and SMS for announcements, offers and re-engagement."
      ]
    ],
    "steps": [
      [
        "Define",
        "We clarify your positioning, voice and visual direction."
      ],
      [
        "Build",
        "We design and develop your website and marketing materials."
      ],
      [
        "Connect",
        "We set up your Google profile, review process, email and SMS."
      ],
      [
        "Maintain",
        "We update content, respond to reviews and improve what works."
      ]
    ],
    "faqs": [
      [
        "Do you design and manage websites?",
        "Yes. We handle development, content updates and conversion-focused improvements."
      ],
      [
        "Can you help with online reviews?",
        "Yes. We support review generation, review responses and reputation building."
      ],
      [
        "Do you create printed materials?",
        "Yes. We design brochures, business cards, treatment menus and promotional collateral."
      ]
    ]
  },
  "events": {
    "hero": "/images/stock/portrait-glamour.webp",
    "hpos": "50% 35%",
    "p1": [
      "/images/stock/clinic-reception.webp",
      "60% 50%"
    ],
    "p2": [
      "/images/creatives/bts-laptop.webp",
      "50% 40%"
    ],
    "lede": "Influencers, models, events and local partnerships that grow your name in the community.",
    "intro": [
      "Some of the best growth comes from people, not posts. We help you build relationships with creators, partners and your local community.",
      "We coordinate influencer collaborations, model recruitment and event logistics so open houses, launches and appreciation events feel polished and bring real results."
    ],
    "bestFor": [
      "Practices hosting launches or open houses",
      "Practices that want creator partnerships",
      "Teams building referral relationships",
      "Practices expanding their local reputation"
    ],
    "signs": [
      "Few people in your area know your practice",
      "You want to try influencers but lack a process",
      "Events take too much staff time",
      "Referral partners are not nurtured"
    ],
    "benefits": [
      [
        "The right creators",
        "Suitable influencers identified, coordinated and managed."
      ],
      [
        "Smooth content shoots",
        "Models and filming logistics organized for you."
      ],
      [
        "Events that deliver",
        "Support for launches, open houses and patient appreciation."
      ],
      [
        "A team that knows the brand",
        "Internal training so staff reflect your messaging and standards."
      ]
    ],
    "steps": [
      [
        "Plan",
        "We set goals and choose the partners or event format."
      ],
      [
        "Recruit",
        "We find and coordinate creators, models and partners."
      ],
      [
        "Run",
        "We manage logistics and brand representation on the day."
      ],
      [
        "Follow up",
        "We capture content, thank partners and keep relationships active."
      ]
    ],
    "faqs": [
      [
        "Do you recruit influencers?",
        "Yes. We identify, coordinate and manage suitable influencer and creator partnerships."
      ],
      [
        "Can you help plan a launch event?",
        "Yes. We support open houses, device launches, patient appreciation events and community promotions."
      ],
      [
        "Do you help with referral partnerships?",
        "Yes. We help identify mutually beneficial professional and local business relationships."
      ]
    ]
  },
  "reporting": {
    "hero": "/images/services/seo.webp",
    "hpos": "55% 50%",
    "p1": [
      "/images/services/web.webp",
      "50% 50%"
    ],
    "p2": [
      "/images/stock/clinic-white.webp",
      "50% 50%"
    ],
    "lede": "See what is working, where patients drop off and what to do next.",
    "intro": [
      "Likes and views are not the goal. The goal is more consultations and more patients. Reporting connects your marketing results to the numbers that matter in your practice.",
      "We track each step from inquiry to consultation to patient, then meet with leadership to adjust the plan."
    ],
    "bestFor": [
      "Owners who want clear numbers",
      "Practices comparing channels and campaigns",
      "Teams with leads but unclear conversion",
      "Practices planning budgets and growth"
    ],
    "signs": [
      "Reports show activity, not results",
      "You do not know your lead-to-consultation rate",
      "You cannot tell which channel brings patients",
      "Marketing and sales results are reviewed separately"
    ],
    "benefits": [
      [
        "Results tied to business",
        "Inquiries, consultations and conversions, not just engagement."
      ],
      [
        "Find the leaks",
        "See where potential patients are lost along the way."
      ],
      [
        "Smarter budgets",
        "Messaging, content, targeting and spend adjusted from data."
      ],
      [
        "Leadership-level reviews",
        "Marketing results viewed alongside sales and operations."
      ]
    ],
    "steps": [
      [
        "Measure",
        "We set up tracking from first inquiry through consultation and treatment."
      ],
      [
        "Report",
        "We share clear, simple reports on performance and conversion."
      ],
      [
        "Review",
        "We meet with leadership to discuss priorities and gaps."
      ],
      [
        "Improve",
        "We optimize campaigns and processes based on what we learn."
      ]
    ],
    "faqs": [
      [
        "What do your reports include?",
        "Marketing performance, audience growth, inquiries, lead-to-consultation tracking and consultation-to-patient conversion."
      ],
      [
        "How often do we meet?",
        "We keep direct communication with your leadership and designated team and schedule regular growth reviews."
      ],
      [
        "Can you track results from other agencies?",
        "Yes. We can review results across your channels and show how they compare."
      ]
    ]
  }
};
