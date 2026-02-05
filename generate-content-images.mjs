import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";

// Configure FAL AI
fal.config({
  credentials: "ea1d1a7a-ffc4-4fcd-aeac-e6e04757c153:9244312a1221724b4776ebad115eb73c"
});

// Consistent style template for minimalist corporate illustrations
const styleTemplate = ", minimalist corporate illustration style, clean geometric shapes, soft neutral colors with cyan (#00afec) accent, professional business graphic, white background, flat vector design, simple modern iconography, no text, no people faces";

// Articles with 3 image concepts each
const articles = [
  {
    slug: "ai-brand-strategy-guide",
    images: [
      { name: "content-1.webp", concept: "AI brain connected to brand elements like logos and color palettes" },
      { name: "content-2.webp", concept: "Strategic framework pyramid with layers building upward" },
      { name: "content-3.webp", concept: "Circular workflow showing content creation and iteration cycle" }
    ]
  },
  {
    slug: "brand-strategy-clothing-brand",
    images: [
      { name: "content-1.webp", concept: "Sustainable fashion supply chain with eco-friendly elements and leaves" },
      { name: "content-2.webp", concept: "Target audience segments represented by different lifestyle icons" },
      { name: "content-3.webp", concept: "Brand differentiation comparing quality craftsmanship versus mass production" }
    ]
  },
  {
    slug: "brand-strategy-coffee-shop",
    images: [
      { name: "content-1.webp", concept: "Cozy community gathering space with coffee cup and connection symbols" },
      { name: "content-2.webp", concept: "Artisanal coffee bean journey from farm to cup" },
      { name: "content-3.webp", concept: "Local neighborhood map pin with community elements" }
    ]
  },
  {
    slug: "brand-strategy-consulting-firm",
    images: [
      { name: "content-1.webp", concept: "Trust and credibility symbols like handshake and verified badge" },
      { name: "content-2.webp", concept: "Specialization versus generalist positioning on a spectrum scale" },
      { name: "content-3.webp", concept: "Implementation methodology with gear and checklist icons" }
    ]
  },
  {
    slug: "brand-strategy-cost",
    images: [
      { name: "content-1.webp", concept: "Pricing tier comparison chart with three levels" },
      { name: "content-2.webp", concept: "Research depth scale showing investment correlation" },
      { name: "content-3.webp", concept: "Business growth stages from startup to enterprise" }
    ]
  },
  {
    slug: "brand-strategy-ecommerce",
    images: [
      { name: "content-1.webp", concept: "Customer journey funnel from discovery to loyalty with shopping cart" },
      { name: "content-2.webp", concept: "Emotional connection heart icon versus price tag comparison" },
      { name: "content-3.webp", concept: "Direct-to-consumer brand shipping box with brand elements" }
    ]
  },
  {
    slug: "brand-strategy-real-estate",
    images: [
      { name: "content-1.webp", concept: "Trust building in real estate with house and shield icon" },
      { name: "content-2.webp", concept: "Personal brand avatar connected to company building" },
      { name: "content-3.webp", concept: "Market niche specialization with location pin and target" }
    ]
  },
  {
    slug: "brand-strategy-restaurant",
    images: [
      { name: "content-1.webp", concept: "Farm-to-table sourcing path with vegetables and plate" },
      { name: "content-2.webp", concept: "Dining experience storytelling with fork and speech bubble" },
      { name: "content-3.webp", concept: "Seasonal calendar with ingredient icons changing" }
    ]
  },
  {
    slug: "brand-strategy-skincare-brand",
    images: [
      { name: "content-1.webp", concept: "Ingredient transparency with magnifying glass and natural elements" },
      { name: "content-2.webp", concept: "Natural leaf versus clinical beaker positioning spectrum" },
      { name: "content-3.webp", concept: "Educational content with book and skincare bottle" }
    ]
  },
  {
    slug: "brand-strategy-solar-company",
    images: [
      { name: "content-1.webp", concept: "Trust building for solar with sun and verified checkmark" },
      { name: "content-2.webp", concept: "Sustainability impact with solar panel and earth globe" },
      { name: "content-3.webp", concept: "Technical expertise simplified with lightbulb and gear" }
    ]
  },
  {
    slug: "brand-strategy-tech-startup",
    images: [
      { name: "content-1.webp", concept: "SaaS brand positioning with cloud and unique marker" },
      { name: "content-2.webp", concept: "Developer trust with code brackets and shield" },
      { name: "content-3.webp", concept: "AI-native innovation with neural network and rocket" }
    ]
  },
  {
    slug: "brand-strategy-travel-agency",
    images: [
      { name: "content-1.webp", concept: "Personalized travel experience with passport and custom path" },
      { name: "content-2.webp", concept: "Adventure exploration with compass and mountain peaks" },
      { name: "content-3.webp", concept: "Expert destination knowledge with globe and badge" }
    ]
  },
  {
    slug: "brand-strategy-wellness-brand",
    images: [
      { name: "content-1.webp", concept: "Holistic wellness transformation with body mind spirit balance" },
      { name: "content-2.webp", concept: "Clinical credibility with heart and medical cross" },
      { name: "content-3.webp", concept: "Community wellness with connected people and health icons" }
    ]
  },
  {
    slug: "how-to-create-brand-strategy",
    images: [
      { name: "content-1.webp", concept: "Brand discovery research with magnifying glass and data charts" },
      { name: "content-2.webp", concept: "Purpose vision values pyramid framework" },
      { name: "content-3.webp", concept: "Audience targeting with bullseye and person icons" }
    ]
  }
];

async function downloadImage(url, filepath) {
  console.log(`   Downloading from: ${url.substring(0, 60)}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
  console.log(`   Saved to: ${filepath}`);
  return filepath;
}

async function generateImage(slug, imageConfig) {
  const prompt = imageConfig.concept + styleTemplate;
  console.log(`\n🎨 Generating ${imageConfig.name} for ${slug}`);
  console.log(`   Prompt: ${prompt.substring(0, 80)}...`);

  try {
    const result = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: {
        prompt: prompt,
        aspect_ratio: "16:9",
        num_images: 1,
        output_format: "webp",
        resolution: "1K"
      },
      logs: false
    });

    const images = result.data?.images || result.images;

    if (images && images.length > 0) {
      const imageUrl = images[0].url;
      const outputDir = `./blog/${slug}`;
      const outputPath = path.join(outputDir, imageConfig.name);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      await downloadImage(imageUrl, outputPath);
      console.log(`✅ Success: ${slug}/${imageConfig.name}`);
      return outputPath;
    } else {
      console.log(`   No images in result:`, JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error(`❌ Error generating ${slug}/${imageConfig.name}:`, error.message);
  }
  return null;
}

async function main() {
  const totalImages = articles.reduce((sum, a) => sum + a.images.length, 0);
  console.log(`🚀 Starting content image generation for ${articles.length} articles (${totalImages} images total)...\n`);

  let completed = 0;

  for (const article of articles) {
    console.log(`\n📁 Processing: ${article.slug}`);

    for (const imageConfig of article.images) {
      await generateImage(article.slug, imageConfig);
      completed++;
      console.log(`   Progress: ${completed}/${totalImages}`);
      // Small delay between requests to avoid rate limiting
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  console.log(`\n✨ Content image generation complete! Generated ${completed} images.`);
}

main();
