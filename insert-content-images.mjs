import fs from "fs";
import path from "path";

// Define where to insert images in each article (after which h2 section)
const insertionPoints = {
  "ai-brand-strategy-guide": [
    { image: "content-1.webp", afterH2: "why-use-ai", alt: "AI-powered brand strategy generation" },
    { image: "content-2.webp", afterH2: "brand-foundation", alt: "Brand strategy framework layers" },
    { image: "content-3.webp", afterH2: "brand-messaging", alt: "Content creation workflow" }
  ],
  "brand-strategy-clothing-brand": [
    { image: "content-1.webp", afterH2: "core-values", alt: "Sustainable fashion values" },
    { image: "content-2.webp", afterH2: "target-audience", alt: "Target audience segments" },
    { image: "content-3.webp", afterH2: "brand-positioning", alt: "Brand differentiation" }
  ],
  "brand-strategy-coffee-shop": [
    { image: "content-1.webp", afterH2: "brand-purpose", alt: "Community gathering space" },
    { image: "content-2.webp", afterH2: "core-values", alt: "Artisanal coffee journey" },
    { image: "content-3.webp", afterH2: "brand-positioning", alt: "Local neighborhood positioning" }
  ],
  "brand-strategy-consulting-firm": [
    { image: "content-1.webp", afterH2: "why-matters", alt: "Trust and credibility" },
    { image: "content-2.webp", afterH2: "positioning", alt: "Specialization vs generalist" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Implementation methodology" }
  ],
  "brand-strategy-cost": [
    { image: "content-1.webp", afterH2: "pricing-factors", alt: "Pricing tier comparison" },
    { image: "content-2.webp", afterH2: "provider-types", alt: "Research depth and scope" },
    { image: "content-3.webp", afterH2: "roi", alt: "Business growth stages" }
  ],
  "brand-strategy-ecommerce": [
    { image: "content-1.webp", afterH2: "why-brand-matters", alt: "Customer journey funnel" },
    { image: "content-2.webp", afterH2: "brand-positioning", alt: "Emotional connection vs price" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Direct-to-consumer branding" }
  ],
  "brand-strategy-real-estate": [
    { image: "content-1.webp", afterH2: "why-matters", alt: "Trust in real estate" },
    { image: "content-2.webp", afterH2: "personal-vs-company", alt: "Personal vs company brand" },
    { image: "content-3.webp", afterH2: "positioning", alt: "Market specialization" }
  ],
  "brand-strategy-restaurant": [
    { image: "content-1.webp", afterH2: "core-values", alt: "Farm-to-table sourcing" },
    { image: "content-2.webp", afterH2: "brand-personality", alt: "Dining experience storytelling" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Seasonal ingredients" }
  ],
  "brand-strategy-skincare-brand": [
    { image: "content-1.webp", afterH2: "core-values", alt: "Ingredient transparency" },
    { image: "content-2.webp", afterH2: "brand-positioning", alt: "Natural vs clinical positioning" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Educational content" }
  ],
  "brand-strategy-solar-company": [
    { image: "content-1.webp", afterH2: "why-brand-matters", alt: "Trust building in solar" },
    { image: "content-2.webp", afterH2: "core-values", alt: "Sustainability impact" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Technical expertise simplified" }
  ],
  "brand-strategy-tech-startup": [
    { image: "content-1.webp", afterH2: "brand-positioning", alt: "SaaS brand positioning" },
    { image: "content-2.webp", afterH2: "core-values", alt: "Developer trust" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "AI-native innovation" }
  ],
  "brand-strategy-travel-agency": [
    { image: "content-1.webp", afterH2: "brand-personality", alt: "Personalized travel experience" },
    { image: "content-2.webp", afterH2: "brand-positioning", alt: "Adventure exploration" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Destination expertise" }
  ],
  "brand-strategy-wellness-brand": [
    { image: "content-1.webp", afterH2: "brand-purpose", alt: "Holistic wellness" },
    { image: "content-2.webp", afterH2: "brand-positioning", alt: "Clinical credibility" },
    { image: "content-3.webp", afterH2: "marketing-goals", alt: "Community wellness" }
  ],
  "how-to-create-brand-strategy": [
    { image: "content-1.webp", afterH2: "brand-discovery", alt: "Brand discovery research" },
    { image: "content-2.webp", afterH2: "brand-foundation", alt: "Purpose vision values" },
    { image: "content-3.webp", afterH2: "target-audience", alt: "Audience targeting" }
  ]
};

// HTML template for content image
function getImageHtml(slug, imageName, altText) {
  return `
        <figure class="content-image">
            <img src="/blog/${slug}/${imageName}" alt="${altText}" width="800" height="450" loading="lazy">
        </figure>
`;
}

// CSS for content images (to be added once per file if not exists)
const contentImageCss = `.content-image{max-width:800px;margin:36px auto;padding:0 24px}.content-image img{width:100%;height:auto;border-radius:var(--border-radius-lg);border:1px solid var(--color-border-light)}`;

function processArticle(slug) {
  const filePath = `./blog/${slug}/index.html`;

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }

  let html = fs.readFileSync(filePath, "utf8");
  const insertions = insertionPoints[slug];

  if (!insertions) {
    console.log(`⚠️ No insertion points defined for: ${slug}`);
    return false;
  }

  // Check if images exist
  for (const insertion of insertions) {
    const imagePath = `./blog/${slug}/${insertion.image}`;
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️ Image not found: ${imagePath} - skipping article`);
      return false;
    }
  }

  // Add content-image CSS if not already present
  if (!html.includes(".content-image")) {
    // Find the closing </style> tag and add CSS before it
    html = html.replace("</style>", contentImageCss + "</style>");
    console.log(`   Added content-image CSS`);
  }

  // Insert images after each h2 section
  let insertCount = 0;
  for (const insertion of insertions) {
    const h2Pattern = new RegExp(`(<h2[^>]*id="${insertion.afterH2}"[^>]*>.*?</h2>)`, "is");
    const match = html.match(h2Pattern);

    if (match) {
      const imageHtml = getImageHtml(slug, insertion.image, insertion.alt);
      // Insert after the first paragraph following the h2
      const h2Index = html.indexOf(match[0]);
      const nextPIndex = html.indexOf("</p>", h2Index);

      if (nextPIndex > -1 && !html.substring(h2Index, nextPIndex + 100).includes(insertion.image)) {
        html = html.slice(0, nextPIndex + 4) + imageHtml + html.slice(nextPIndex + 4);
        insertCount++;
        console.log(`   Inserted ${insertion.image} after #${insertion.afterH2}`);
      }
    } else {
      // Try alternative: insert after first h2 containing similar text
      console.log(`   Could not find h2 with id="${insertion.afterH2}"`);
    }
  }

  if (insertCount > 0) {
    fs.writeFileSync(filePath, html);
    console.log(`✅ Updated ${slug} with ${insertCount} images`);
    return true;
  }

  return false;
}

async function main() {
  console.log("🖼️ Inserting content images into blog articles...\n");

  const slugs = Object.keys(insertionPoints);
  let updated = 0;

  for (const slug of slugs) {
    console.log(`\n📁 Processing: ${slug}`);
    if (processArticle(slug)) {
      updated++;
    }
  }

  console.log(`\n✨ Done! Updated ${updated}/${slugs.length} articles.`);
}

main();
