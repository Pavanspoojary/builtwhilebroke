export interface LegalDocument {
  id: string;
  title: string;
  effectiveDate: string;
  summary: string;
  content: {
    sectionTitle: string;
    paragraphs: string[];
  }[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'acceptable-use-policy',
    title: 'Acceptable Use Policy',
    effectiveDate: 'January 15, 2025',
    summary: 'Rules and guidelines governing the permitted client-side execution, security boundaries, and responsible usage of BuiltWhileBroke workbenches.',
    content: [
      {
        sectionTitle: '1. Purpose & Scope',
        paragraphs: [
          'This Acceptable Use Policy ("AUP") governs the acceptable utilization of BuiltWhileBroke ("Platform"), an ecosystem of 100% client-side, in-browser developer utilities, diagram engines, and sandboxes.',
          'By accessing or utilizing any workbench within this Platform, you agree to comply with this policy and ensure all computing tasks executed on your local machine adhere to lawful practices.',
        ],
      },
      {
        sectionTitle: '2. Permitted Client-Side Computing',
        paragraphs: [
          'BuiltWhileBroke provides web-based tools powered by WebAssembly (WASM), WebGPU, Web Workers, and the HTML5 Canvas/Web Audio API. All data processing occurs entirely within your local browser runtime sandbox.',
          'You are permitted to execute arbitrary text transformations, cryptographic operations, image editing, database querying, and code compilation for personal, educational, commercial, and enterprise workflows.',
        ],
      },
      {
        sectionTitle: '3. Prohibited Malicious Activities',
        paragraphs: [
          'You may not use the Platform or any bundled utility to generate, obfuscate, or distribute malicious code, ransomware, denial-of-service payloads, unauthorized exploits, or unlawful surveillance materials.',
          'You may not attempt to circumvent browser sandbox constraints, exploit browser-engine zero-days, or distribute automated spam through embedded client tools.',
        ],
      },
      {
        sectionTitle: '4. Zero-Telemetry & Fair Resource Consumption',
        paragraphs: [
          'Because BuiltWhileBroke does not route your payload data to external servers, resource consumption (CPU, RAM, GPU) is confined to your local hardware. Users are responsible for managing their local browser resource utilization during heavy compute tasks.',
        ],
      },
    ],
  },
  {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    effectiveDate: 'February 1, 2025',
    summary: 'Our strict zero-cookie architecture explaining how client-side storage is utilized without tracking or marketing identifiers.',
    content: [
      {
        sectionTitle: '1. Zero-Cookie Architecture',
        paragraphs: [
          'BuiltWhileBroke enforces a strict Zero-Cookie Architecture. We do not set, read, or distribute any HTTP tracking cookies, marketing cookies, third-party advertising identifiers, or cross-site fingerprinting beacons.',
          'When you load our pages, no cookie headers are transmitted to remote servers.',
        ],
      },
      {
        sectionTitle: '2. Client-Side Local Storage (localStorage & IndexedDB)',
        paragraphs: [
          'To ensure seamless user experience across browser sessions, certain workbenches utilize standard browser-native storage APIs strictly on your device:',
          '• LocalStorage: Used solely for storing your local preferences (such as audio feedback toggle and workbench frequency sorting counts).',
          '• IndexedDB: Used by in-browser database engines (e.g. PGlite, SQLime) and AI model caching (e.g. WebLLM weights) to store temporary datasets on your machine.',
          'This data never leaves your browser and is never synchronized with any remote cloud infrastructure.',
        ],
      },
      {
        sectionTitle: '3. Instant Local Data Purge',
        paragraphs: [
          'You retain total control over your local state. You can completely wipe all cached databases, tool usage stats, and preferences at any time by clicking the "Zero Telemetry Purge" icon in the navigation bar or executing standard browser cache clearing.',
        ],
      },
    ],
  },
  {
    id: 'data-processing-agreement',
    title: 'Data Processing Agreement',
    effectiveDate: 'January 20, 2025',
    summary: 'Clarifying data ownership, zero-transmission guarantees, and client-side processing boundaries under GDPR and CCPA standards.',
    content: [
      {
        sectionTitle: '1. Data Controller & Processor Status',
        paragraphs: [
          'Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you (the user) remain the sole Data Controller of all information, payloads, media, and source code loaded into BuiltWhileBroke workbenches.',
          'BuiltWhileBroke does not act as a remote Data Processor because user data is processed entirely on the client side inside your web browser instance without ingestion by our servers.',
        ],
      },
      {
        sectionTitle: '2. Non-Transmission & Zero Interception Guarantee',
        paragraphs: [
          'All cryptographic hashing, PDF generation, SQL queries, regex matching, and image processing are computed locally using compiled WebAssembly and JavaScript runtimes.',
          'No user inputs, tokens, encryption keys, or generated files are sent over the network or saved in remote database logs.',
        ],
      },
      {
        sectionTitle: '3. Third-Party CDN & Asset Hosting',
        paragraphs: [
          'Static assets (HTML, CSS, JavaScript, WebAssembly binaries, font files) are delivered via globally distributed static Content Delivery Networks (CDNs). CDN providers only receive standard network routing metadata (IP address, user-agent) necessary to deliver static bundle files to your browser.',
        ],
      },
    ],
  },
  {
    id: 'disclaimer',
    title: 'Disclaimer',
    effectiveDate: 'March 1, 2025',
    summary: 'Legal disclaimers regarding open source software warranties, client-side execution liability, and upstream project credits.',
    content: [
      {
        sectionTitle: '1. "As Is" Warranty Disclaimer',
        paragraphs: [
          'BuiltWhileBroke and all embedded open-source workbenches are provided on an "AS IS" and "AS AVAILABLE" basis, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, non-infringement, or error-free execution.',
        ],
      },
      {
        sectionTitle: '2. Upstream Open Source Acknowledgements',
        paragraphs: [
          'BuiltWhileBroke curates, adapts, and showcases world-class open-source projects created by independent developers and community maintainers worldwide. All respective trademarks, brand names, and software copyrights belong strictly to their original authors.',
        ],
      },
      {
        sectionTitle: '3. Limitation of Liability',
        paragraphs: [
          'In no event shall the authors, contributors, or maintainers of BuiltWhileBroke be liable for any claim, damages, data loss, hardware strain, business interruption, or other liability arising from the use of or inability to use the tools provided on this Platform.',
        ],
      },
    ],
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    effectiveDate: 'January 15, 2025',
    summary: 'Our foundational privacy commitment guaranteeing 100% client-side privacy, zero telemetry, and zero third-party trackers.',
    content: [
      {
        sectionTitle: '1. Our Foundational Privacy Philosophy',
        paragraphs: [
          'At BuiltWhileBroke, privacy is not an afterthought or a setting—it is our fundamental engineering architecture. The platform was built from the ground up to operate without backends, databases, or analytics tracking.',
          'We do not collect your personal information, email address, name, IP address, browsing behavior, or usage history.',
        ],
      },
      {
        sectionTitle: '2. Information We Never Collect',
        paragraphs: [
          '• We do not collect or log your IP address.',
          '• We do not track your tool search queries or clicks.',
          '• We do not inspect, intercept, or store files or text inputs you process.',
          '• We do not use Google Analytics, Facebook Pixel, Hotjar, or any telemetry scripts.',
        ],
      },
      {
        sectionTitle: '3. Local Device Storage & Control',
        paragraphs: [
          'Any persistent data (e.g. customized settings, locally stored SQLite databases) is saved directly in your browser’s private storage sandbox. You have unilateral authority to clear this data at any moment.',
        ],
      },
      {
        sectionTitle: '4. Changes to this Policy',
        paragraphs: [
          'Because our architecture is stateless and serverless, our privacy commitments remain immutable. Any structural updates to this document will be transparently timestamped on this Legal Hub.',
        ],
      },
    ],
  },
  {
    id: 'refund-policy',
    title: 'Refund Policy',
    effectiveDate: 'March 1, 2025',
    summary: 'BuiltWhileBroke is 100% free and open-source software with zero paywalls, subscriptions, or hidden charges.',
    content: [
      {
        sectionTitle: '1. 100% Free & Open Access',
        paragraphs: [
          'BuiltWhileBroke is a completely free, open-access public platform. There are no paid tiers, subscriptions, paywalls, trial periods, or credit card requirements to use any tool.',
          'Because no financial transactions or recurring charges take place on this platform, traditional billing refund requests do not apply.',
        ],
      },
      {
        sectionTitle: '2. Voluntary Community Sponsorships',
        paragraphs: [
          'If you choose to support upstream open-source maintainers or BuiltWhileBroke via voluntary GitHub Sponsors or OpenCollective donations, all contributions are non-refundable gifts given freely to sustain independent open-source engineering.',
        ],
      },
    ],
  },
  {
    id: 'security-policy',
    title: 'Security Policy',
    effectiveDate: 'February 1, 2025',
    summary: 'Cryptographic standards, browser sandboxing protocols, and vulnerability disclosure policies.',
    content: [
      {
        sectionTitle: '1. In-Browser Security & Cryptography',
        paragraphs: [
          'BuiltWhileBroke utilizes modern web standards and the native Web Cryptography API (SubtleCrypto) to ensure all encryption, decryption, and hashing routines (including AES-256-GCM, PBKDF2 with 100,000 iterations, and SHA-256) are calculated with high-performance cryptographic security.',
        ],
      },
      {
        sectionTitle: '2. Sandboxing & Isolation',
        paragraphs: [
          'Every workbench runs inside isolated execution contexts with strict Content Security Policy headers, preventing unauthorized cross-origin resource access and shielding user workloads from cross-site scripting vulnerabilities.',
        ],
      },
      {
        sectionTitle: '3. Vulnerability Reporting',
        paragraphs: [
          'We take platform security with utmost seriousness. If you discover a potential vulnerability, bug, or security flaw within any interface, please report it directly to the repository maintainers via GitHub Issues for expedited remediation.',
        ],
      },
    ],
  },
  {
    id: 'service-level-agreement',
    title: 'Service Level Agreement',
    effectiveDate: 'February 15, 2025',
    summary: 'Availability, offline-first client architecture, and edge content distribution performance.',
    content: [
      {
        sectionTitle: '1. High Availability via Edge CDN',
        paragraphs: [
          'BuiltWhileBroke is distributed via globally redundant static Edge delivery networks boasting 99.99% uptime. Because the application logic executes locally in your browser, once loaded, the platform operates independently of backend server health.',
        ],
      },
      {
        sectionTitle: '2. Offline-First Resilience',
        paragraphs: [
          'Most utilities support offline execution once cached by your browser’s service worker and cache storage. Network disconnections will not terminate in-progress offline computations.',
        ],
      },
      {
        sectionTitle: '3. Maintenance & Continuous Deployment',
        paragraphs: [
          'Platform improvements, new workbench additions, and dependency updates are deployed atomically with zero downtime to active client sessions.',
        ],
      },
    ],
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    effectiveDate: 'January 15, 2025',
    summary: 'Terms and conditions governing use of the BuiltWhileBroke platform, open source licenses, and legal compliance.',
    content: [
      {
        sectionTitle: '1. Acceptance of Terms',
        paragraphs: [
          'By accessing and using BuiltWhileBroke ("the Platform"), you agree to be bound by these Terms of Service, our Acceptable Use Policy, and our Privacy Policy.',
          'If you do not agree with any portion of these terms, you should cease usage of the Platform.',
        ],
      },
      {
        sectionTitle: '2. Open Source Licenses & Intellectual Property',
        paragraphs: [
          'All software components and workbenches curated within BuiltWhileBroke are distributed under permissive or copyleft open-source licenses (including MIT, Apache 2.0, AGPL-3.0, BSD-3-Clause).',
          'Users are free to study, audit, fork, and inspect the client-side source code in accordance with the respective upstream license terms.',
        ],
      },
      {
        sectionTitle: '3. User Content & Work Product',
        paragraphs: [
          'BuiltWhileBroke claims zero ownership or intellectual property rights over any code, diagrams, images, documents, or data you create, modify, or process using these tools. All outputs belong solely to you.',
        ],
      },
      {
        sectionTitle: '4. Governing Law',
        paragraphs: [
          'These Terms shall be governed by and construed in accordance with generally applicable principles of open-source software law, without giving effect to any conflict of law principles.',
        ],
      },
    ],
  },
];
