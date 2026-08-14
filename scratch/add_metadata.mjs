import fs from 'fs';
import path from 'path';

const pages = {
  'about': {
    title: 'About AURUM EA | Gold Trading System Experts',
    desc: 'Discover the team behind AURUM EA, a MyFXBook verified automated gold trading system designed for disciplined, emotionless XAUUSD trading.'
  },
  'contact': {
    title: 'Contact AURUM EA | Support & Enquiries',
    desc: "Get in touch with the AURUM EA support team. We're here to help with your automated gold trading system setup, licensing, and general inquiries."
  },
  'faq': {
    title: 'AURUM EA FAQ | Automated Gold Trading Questions',
    desc: 'Find answers to frequently asked questions about AURUM EA, including setup, risk management, brokers, and MyFXBook verified performance.'
  },
  'pricing': {
    title: 'AURUM EA Pricing | Lifetime Gold Trading Licenses',
    desc: 'Choose your AURUM EA lifetime license. Get full access to our MyFXBook verified automated gold trading system with VIP support and updates.'
  },
  'privacy': {
    title: 'Privacy Policy | AURUM EA',
    desc: 'Read the privacy policy for AURUM EA. Learn how we protect your data and personal information when using our automated gold trading website.'
  },
  'refund': {
    title: 'Refund Policy | AURUM EA',
    desc: 'Review the refund policy for AURUM EA software licenses. Understand our terms regarding digital product purchases and support.'
  },
  'results': {
    title: 'AURUM EA Live Results | MyFXBook Verified',
    desc: 'View live, broker-synced MyFXBook performance results for AURUM EA. See our +107% gain, $530k profit, and monthly analytics for XAUUSD.'
  },
  'setup-guide': {
    title: 'AURUM EA Setup Guide | Installation Instructions',
    desc: 'Step-by-step guide to installing and configuring AURUM EA. Learn how to set up your VPS, MetaTrader 5, and risk settings for automated trading.'
  },
  'terms': {
    title: 'Terms & Conditions | AURUM EA',
    desc: 'Read the terms and conditions for using AURUM EA. Important legal information regarding our automated gold trading software and services.'
  },
  'thank-you': {
    title: 'Payment Successful | Welcome to AURUM EA',
    desc: 'Thank you for purchasing AURUM EA. Your lifetime license is confirmed and your automated gold trading journey begins now.'
  }
};

const basePath = path.join(process.cwd(), 'src/app');

for (const [route, meta] of Object.entries(pages)) {
  let fileExt = 'page.js';
  if (route === 'thank-you') fileExt = 'page.jsx';
  
  const filePath = path.join(basePath, route, fileExt);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if metadata already exists
    if (!content.includes('export const metadata')) {
      const metaExport = `\nexport const metadata = {\n  title: '${meta.title.replace(/'/g, "\\'")}',\n  description: '${meta.desc.replace(/'/g, "\\'")}',\n};\n`;
      
      // Insert after imports
      const lines = content.split('\\n');
      let insertIdx = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          insertIdx = i + 1;
        }
      }
      
      lines.splice(insertIdx, 0, metaExport);
      fs.writeFileSync(filePath, lines.join('\\n'));
      console.log(`Updated ${route}/${fileExt}`);
    } else {
      console.log(`Skipped ${route}/${fileExt} - metadata already exists`);
    }
  } else {
    console.log(`File not found: ${filePath}`);
  }
}
