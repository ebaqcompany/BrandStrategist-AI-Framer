import { fal } from "@fal-ai/client";
import fs from "fs";
import path from "path";

// Configure FAL AI
fal.config({
  credentials: "ea1d1a7a-ffc4-4fcd-aeac-e6e04757c153:9244312a1221724b4776ebad115eb73c"
});

// Articles and their prompts - business/professional style stock photos
const articles = [
  {
    slug: "how-to-create-brand-strategy",
    prompt: "Professional business team brainstorming brand strategy on whiteboard, modern office setting, sticky notes and diagrams, collaborative meeting, warm natural lighting, corporate photography style, high quality stock photo, photorealistic"
  },
  {
    slug: "brand-strategy-restaurant",
    prompt: "Restaurant owner reviewing brand materials and menu design at wooden table, warm ambient lighting, coffee shop interior, creative business planning, professional stock photography, photorealistic"
  },
  {
    slug: "brand-strategy-ecommerce",
    prompt: "Entrepreneur working on laptop with e-commerce packaging and products around, modern home office, online business branding, shipping boxes with custom design, professional stock photography, photorealistic"
  },
  {
    slug: "brand-strategy-fitness-brand",
    prompt: "Fitness studio owner or personal trainer in modern gym setting planning marketing strategy on tablet, athletic branding materials visible, energetic professional environment, stock photography style, photorealistic"
  },
  {
    slug: "how-to-rebrand-your-business",
    prompt: "Business professional comparing old and new brand designs on desk, before and after brand materials, transformation concept, modern office, creative rebranding process, stock photography, photorealistic"
  },
  {
    slug: "brand-strategy-vs-brand-identity",
    prompt: "Split concept showing strategy documents on one side and visual design materials on other, business desk with brand guidelines and logo sketches, comparison concept, professional stock photo, photorealistic"
  },
  {
    slug: "brand-positioning",
    prompt: "Business strategist analyzing competitor positioning on large screen or whiteboard, market positioning matrix diagram, chess pieces metaphor for strategy, professional stock photography, photorealistic"
  },
  {
    slug: "brand-strategy-consulting-firm",
    prompt: "Professional consultants in meeting room with client, business presentation, corporate advisory setting, suits and modern office, consulting firm atmosphere, high quality stock photo, photorealistic"
  },
  {
    slug: "brand-strategy-real-estate",
    prompt: "Real estate agent reviewing property branding materials, house keys and marketing documents on desk, professional realtor in modern office, property marketing, stock photography, photorealistic"
  },
  {
    slug: "brand-strategy-cost",
    prompt: "Business professional reviewing pricing documents and calculator, budget planning for branding project, investment concept, financial documents and laptop, professional stock photography, photorealistic"
  }
];

async function downloadImage(url, filepath) {
  console.log(`   Downloading from: ${url.substring(0, 80)}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
  console.log(`   Saved to: ${filepath}`);
  return filepath;
}

async function generateThumbnail(article) {
  console.log(`\n🎨 Generating thumbnail for: ${article.slug}`);

  try {
    const result = await fal.subscribe("fal-ai/nano-banana-pro", {
      input: {
        prompt: article.prompt,
        aspect_ratio: "16:9",
        num_images: 1,
        output_format: "webp",
        resolution: "1K"
      },
      logs: false
    });

    // Access images directly from result (not result.data)
    const images = result.data?.images || result.images;

    if (images && images.length > 0) {
      const imageUrl = images[0].url;
      const outputDir = `./blog/${article.slug}`;
      const outputPath = path.join(outputDir, "thumbnail.webp");

      // Ensure directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      await downloadImage(imageUrl, outputPath);
      console.log(`✅ Success: ${article.slug}`);
      return outputPath;
    } else {
      console.log(`   No images in result:`, JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error(`❌ Error generating ${article.slug}:`, error);
  }
  return null;
}

async function main() {
  console.log("🚀 Starting thumbnail generation for 10 articles...\n");

  for (const article of articles) {
    await generateThumbnail(article);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\n✨ Thumbnail generation complete!");
}

main();
