export interface Program {
  id: number;
  program_id: string;
  name: string;
  short_description: string;
  image_url: string;
  page_url: string;
}

export const programs: Program[] = [
  {
    "id": 1,
    "program_id": "with-jaz-1-1",
    "name": "1:1 Personal Training",
    "short_description": "Working with a personal trainer helps you reach your goal faster while teaching you how to independently sustain your results after the process is complete.",
    "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    "page_url": "onetoonept"
  },
  {
    "id": 2,
    "program_id": "with-jaz-2-1",
    "name": "2:1 Personal Training",
    "short_description": "Share all the benefits of 1:1 training. Studies show exercising with a partner can increase calories burned by up to 25% due to friendly motivation.",
    "image_url": "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80",
    "page_url": "couplept"
  },
  {
    "id": 3,
    "program_id": "with-jaz-online",
    "name": "Online Coaching",
    "short_description": "Get customized guidance remotely. Work through your personalized fitness and nutrition program from anywhere in the world with constant accountability.",
    "image_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    "page_url": "onlinept"
  },
  {
    "id": 4,
    "program_id": "with-jaz-nutrition",
    "name": "Health Check",
    "short_description": "Identify symptoms and lifestyle habits holding you back. Build sustainable nutrition plans to target high blood sugar, cholesterol, or blood pressure.",
    "image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    "page_url": "nutritionpt"
  }
];
