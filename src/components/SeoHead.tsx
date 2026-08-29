import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToolItem } from '../types/tool';

interface SeoHeadProps {
  title?: string;
  description?: string;
  tool?: ToolItem;
  pageType?: 'home' | 'tools' | 'tool-detail' | 'legal';
}

const DEFAULT_TITLE = 'BuiltWhileBroke — 100% In-Browser Open Source Workbenches';
const DEFAULT_DESCRIPTION =
  'A curated ecosystem of 34+ essential developer utilities, diagram engines, and sandboxes. 100% in-browser computation with zero cloud tracking, zero cookies, and zero server roundtrips.';
const SITE_URL = 'https://builtwhilebroke.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  tool,
  pageType = 'home',
}) => {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}${location.search}`;

  const resolvedTitle = tool
    ? `${tool.name} — ${tool.tagline} | BuiltWhileBroke`
    : title
    ? `${title} | BuiltWhileBroke`
    : DEFAULT_TITLE;

  const resolvedDescription = tool ? tool.description : description;

  useEffect(() => {
    // 1. Update Document Title
    document.title = resolvedTitle;

    // 2. Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Helper to set link tags (e.g. canonical)
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // Standard SEO Tags
    setMeta('description', resolvedDescription);
    setMeta('keywords', tool 
      ? `${tool.name}, ${tool.tags.join(', ')}, in-browser tool, client-side WASM, zero tracking, open source ${tool.license}`
      : 'developer tools, client-side workbenches, zero telemetry, open source, WebAssembly, privacy utilities, SQLite WASM, PostgreSQL WASM, Inpaint Web, Documenso, CyberChef, offline tools'
    );
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('author', 'BuiltWhileBroke');
    setLink('canonical', canonicalUrl);

    // OpenGraph Protocol Tags
    setMeta('og:title', resolvedTitle, true);
    setMeta('og:description', resolvedDescription, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:site_name', 'BuiltWhileBroke', true);
    setMeta('og:type', tool ? 'article' : 'website', true);
    setMeta('og:image', DEFAULT_IMAGE, true);
    setMeta('og:locale', 'en_US', true);

    // Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', resolvedTitle);
    setMeta('twitter:description', resolvedDescription);
    setMeta('twitter:image', DEFAULT_IMAGE);

    // 4. Inject Dynamic Schema.org JSON-LD Structured Data
    const existingSchema = document.getElementById('bwb-dynamic-schema');
    if (existingSchema) existingSchema.remove();

    let schemaData: any[] = [];

    // Global WebSite & Organization Schema
    schemaData.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BuiltWhileBroke',
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/tools?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    });

    schemaData.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BuiltWhileBroke',
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
      sameAs: ['https://github.com/Pavanspoojary/builtwhilebroke'],
    });

    // Tool Specific SoftwareApplication Schema (for Google SGE / ChatGPT / Perplexity)
    if (tool) {
      schemaData.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: tool.name,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'All (In-Browser WebAssembly / JavaScript)',
        browserRequirements: 'Requires modern browser with WebAssembly / Web Workers',
        description: tool.description,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: tool.features,
        license: tool.license,
        softwareRequirements: '100% Client-Side In-Browser Execution',
        author: {
          '@type': 'Person',
          name: tool.author,
          url: tool.githubUrl,
        },
      });

      // Breadcrumb Schema
      schemaData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${SITE_URL}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: tool.name,
            item: canonicalUrl,
          },
        ],
      });
    }

    // FAQ Schema for AI Search Engines on Home & Tools Pages
    if (pageType === 'home' || pageType === 'tools') {
      schemaData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is BuiltWhileBroke?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'BuiltWhileBroke is a curated suite of 34+ world-class, 100% in-browser open source developer utilities, diagram engines, and sandboxes that execute entirely client-side with zero cloud tracking and zero server storage.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is BuiltWhileBroke free to use for commercial projects?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. BuiltWhileBroke is 100% free and open access under permissive and copyleft open source licenses (MIT, Apache-2.0, LGPL-3.0, BSD-3-Clause). No accounts, subscriptions, or credit cards are required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does BuiltWhileBroke send my files, database queries, or tokens to remote servers?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. All processing (including PostgreSQL WASM queries, SQLite compilation, image inpainting, cryptographic hashing, and PDF generation) occurs locally inside your web browser sandbox using WebAssembly and Web Workers.',
            },
          },
        ],
      });
    }

    const scriptTag = document.createElement('script');
    scriptTag.id = 'bwb-dynamic-schema';
    scriptTag.type = 'application/ld+json';
    scriptTag.text = JSON.stringify(schemaData);
    document.head.appendChild(scriptTag);
  }, [resolvedTitle, resolvedDescription, canonicalUrl, tool, pageType]);

  return null;
};
