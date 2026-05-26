import fs from 'fs';

function parseTestimonials(text: string) {
  // Normalize newlines
  const fileContent = text.replace(/\r\n/g, '\n');
  
  // Split by "- id:" block
  const blocks = fileContent.split(/\n-\s+id:\s+/);
  if (blocks[0].startsWith('- id:')) {
    blocks[0] = blocks[0].substring(5);
  } else {
    blocks.shift(); // remove header
  }

  const items: any[] = [];

  for (const block of blocks) {
    // Each block starts with the ID number
    const lines = block.split('\n');
    const idLine = lines[0].trim();
    const id = parseInt(idLine, 10);
    if (isNaN(id)) continue;

    // Join back the remaining lines to parse fields
    const content = lines.slice(1).join('\n');

    // Extract featured
    const featuredMatch = content.match(/featured:\s*(\w+)/);
    const featured = featuredMatch ? featuredMatch[1] === 'true' : false;

    // Extract title
    const titleMatch = content.match(/title:\s*["']([\s\S]*?)["']\n/);
    let title = '';
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      // try unquoted or simple Match
      const basicTitle = content.match(/title:\s*(.*)\n/);
      title = basicTitle ? basicTitle[1].trim().replace(/^["']|["']$/g, '') : '';
    }

    // Extract author
    const authorMatch = content.match(/author:\s*["']([\s\S]*?)["']\n/);
    let author = '';
    if (authorMatch) {
      author = authorMatch[1].trim();
    } else {
      const basicAuthor = content.match(/author:\s*(.*)\n/);
      author = basicAuthor ? basicAuthor[1].trim().replace(/^["']|["']$/g, '') : '';
    }

    // Extract image
    const imageMatch = content.match(/image:\s*["'](.*?)["']/);
    const image = imageMatch ? imageMatch[1].trim() : 'img/testimonials/default.jpg';

    // Extract link
    const linkMatch = content.match(/link:\s*["'](.*?)["']/);
    const link = linkMatch ? linkMatch[1].trim() : '';

    // Extract description
    // Description is everything after "description:" key
    const descIndex = content.indexOf('description:');
    let description = '';
    if (descIndex !== -1) {
      // Get all text after description:
      let descPart = content.substring(descIndex + 12).trim();
      // Remove leading quotes or formatting
      if (descPart.startsWith('"')) {
        // Find closing quote (it could be at the end or we can just drop the outer quotes)
        descPart = descPart.substring(1);
        if (descPart.endsWith('"')) {
          descPart = descPart.substring(0, descPart.length - 1);
        }
      } else if (descPart.startsWith("'")) {
        descPart = descPart.substring(1);
        if (descPart.endsWith("'")) {
          descPart = descPart.substring(0, descPart.length - 1);
        }
      }
      
      // Clean up triple roll spaces / escapes
      description = descPart
        .replace(/^[ \t]+/gm, '') // remove leading spaces from each line
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .trim();
    }

    items.push({
      id,
      featured,
      testimonial: {
        title,
        author,
        image,
        link,
        description
      }
    });
  }

  return items;
}

async function main() {
  try {
    // Hardcoded high-fidelity Programs
    const programsData = [
      {
        id: 1,
        program_id: "with-jaz-1-1",
        name: "1:1 Personal Training",
        short_description: "Working with a personal trainer helps you reach your goal faster while teaching you how to independently sustain your results after the process is complete.",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
        page_url: "onetoonept"
      },
      {
        id: 2,
        program_id: "with-jaz-2-1",
        name: "2:1 Personal Training",
        short_description: "Share all the benefits of 1:1 training. Studies show exercising with a partner can increase calories burned by up to 25% due to friendly motivation.",
        image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        page_url: "couplept"
      },
      {
        id: 3,
        program_id: "with-jaz-online",
        name: "Online Coaching",
        short_description: "Get customized guidance remotely. Work through your personalized fitness and nutrition program from anywhere in the world with constant accountability.",
        image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        page_url: "onlinept"
      },
      {
        id: 4,
        program_id: "with-jaz-nutrition",
        name: "Health Check",
        short_description: "Identify symptoms and lifestyle habits holding you back. Build sustainable nutrition plans to target high blood sugar, cholesterol, or blood pressure.",
        image_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
        page_url: "nutritionpt"
      }
    ];

    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data', { recursive: true });
    }

    // Write programs.ts
    const programsOutput = `export interface Program {
  id: number;
  program_id: string;
  name: string;
  short_description: string;
  image_url: string;
  page_url: string;
}

export const programs: Program[] = ${JSON.stringify(programsData, null, 2)};
`;
    fs.writeFileSync('src/data/programs.ts', programsOutput);
    console.log('Success: Wrote src/data/programs.ts');

    // Parse testimonials using custom robust parser
    const testimonialsText = fs.readFileSync('testimonials-raw.yml', 'utf-8');
    const testimonialsData = parseTestimonials(testimonialsText);

    // Write testimonials.ts
    const testimonialsOutput = `export interface TestimonialItem {
  id: number;
  featured: boolean;
  testimonial: {
    title: string;
    author: string;
    image: string;
    link: string;
    description: string;
  };
}

export const testimonials: TestimonialItem[] = ${JSON.stringify(testimonialsData, null, 2)};
`;
    fs.writeFileSync('src/data/testimonials.ts', testimonialsOutput);
    console.log(`Success: Wrote src/data/testimonials.ts with ${testimonialsData.length} records`);

  } catch (err) {
    console.error('Error in main parsing script:', err);
  }
}

main();
