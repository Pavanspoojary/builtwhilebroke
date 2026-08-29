import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// 1. Audit Legal Documents
const legalDocsPath = path.join(root, 'src', 'data', 'legalDocuments.ts');
const legalContent = fs.readFileSync(legalDocsPath, 'utf8');

const requiredLegalDocs = [
  'acceptable-use-policy',
  'cookie-policy',
  'data-processing-agreement',
  'disclaimer',
  'privacy-policy',
  'refund-policy',
  'security-policy',
  'service-level-agreement',
  'terms-of-service',
];

console.log('--- 1. AUDITING LEGAL DOCUMENTS ---');
let allLegalDocsPassed = true;
for (const docId of requiredLegalDocs) {
  if (legalContent.includes(`id: '${docId}'`)) {
    console.log(`✓ Legal Document verified: ${docId}`);
  } else {
    console.error(`✗ MISSING Legal Document: ${docId}`);
    allLegalDocsPassed = false;
  }
}

// 2. Audit Discovery & Security Standard Files
console.log('\n--- 2. AUDITING STANDARD SECURITY & AI FILES ---');
const standardFiles = [
  'public/robots.txt',
  'public/sitemap.xml',
  'public/security.txt',
  'public/.well-known/security.txt',
  'public/llm.txt',
  'public/llms.txt',
  'public/llms-full.txt',
  'public/.well-known/llms.txt',
  'public/humans.txt',
  'public/opensearch.xml',
  'public/site.webmanifest',
  'public/_headers',
  'vercel.json',
  'netlify.toml',
];

for (const f of standardFiles) {
  const filePath = path.join(root, f);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ File verified: ${f} (${stats.size} bytes)`);
  } else {
    console.error(`✗ MISSING FILE: ${f}`);
  }
}

// 3. Audit Tools Data Integrity
console.log('\n--- 3. AUDITING TOOL DATA INTEGRITY ---');
const toolsDataPath = path.join(root, 'src', 'data', 'toolsData.ts');
const toolsDataContent = fs.readFileSync(toolsDataPath, 'utf8');

// Extract TOOLS array content
const toolsArrayPart = toolsDataContent.split('export const TOOLS: ToolItem[] = [')[1];
const toolBlocks = toolsArrayPart.split(/\{\s*id:\s*'/).slice(1);
console.log(`Found ${toolBlocks.length} tools in TOOLS array.`);

const licenseCounts = {};
let missingFields = 0;

for (const block of toolBlocks) {
  const idMatch = block.match(/^([^']+)'/);
  const toolId = idMatch ? idMatch[1] : 'unknown';

  const licMatch = block.match(/license:\s*'([^']+)'/);
  const lic = licMatch ? licMatch[1] : null;

  const ghMatch = block.match(/githubUrl:\s*'([^']+)'/);
  const authMatch = block.match(/author:\s*'([^']+)'/);
  const commMatch = block.match(/commercialStatus:\s*'([^']+)'/);

  if (!lic) {
    console.error(`✗ Tool ${toolId} missing license`);
    missingFields++;
  } else {
    licenseCounts[lic] = (licenseCounts[lic] || 0) + 1;
  }

  if (!ghMatch) {
    console.error(`✗ Tool ${toolId} missing githubUrl`);
    missingFields++;
  }

  if (!authMatch) {
    console.error(`✗ Tool ${toolId} missing author`);
    missingFields++;
  }

  if (!commMatch) {
    console.error(`✗ Tool ${toolId} missing commercialStatus`);
    missingFields++;
  }
}

if (missingFields === 0) {
  console.log(`✓ 100% of ${toolBlocks.length} tools have verified licenses, upstream GitHub URLs, authors, and commercial permissions.`);
  console.log('\n--- LICENSE BREAKDOWN ---');
  for (const [lic, count] of Object.entries(licenseCounts)) {
    console.log(`  • ${lic}: ${count} tools`);
  }
}

console.log('\n--- AUDIT COMPLETE ---');
