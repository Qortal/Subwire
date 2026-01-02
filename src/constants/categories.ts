/**
 * Article/Publication Categories for Perennial
 * Exhaustive list of all available categories
 */

export interface Category {
  id: number;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Qortal' },
  { id: 2, name: 'Technology' },
  { id: 3, name: 'Science' },
  { id: 4, name: 'Philosophy' },
  { id: 5, name: 'Politics' },
  { id: 6, name: 'Economics' },
  { id: 7, name: 'Business' },
  { id: 8, name: 'Finance' },
  { id: 9, name: 'Cryptocurrency' },
  { id: 10, name: 'History' },
  { id: 11, name: 'Culture' },
  { id: 12, name: 'Arts' },
  { id: 13, name: 'Literature' },
  { id: 14, name: 'Poetry' },
  { id: 15, name: 'Music' },
  { id: 16, name: 'Film' },
  { id: 17, name: 'Photography' },
  { id: 18, name: 'Design' },
  { id: 19, name: 'Education' },
  { id: 20, name: 'Health' },
  { id: 21, name: 'Wellness' },
  { id: 22, name: 'Fitness' },
  { id: 23, name: 'Nutrition' },
  { id: 24, name: 'Psychology' },
  { id: 25, name: 'Spirituality' },
  { id: 26, name: 'Religion' },
  { id: 27, name: 'Travel' },
  { id: 28, name: 'Adventure' },
  { id: 29, name: 'Nature' },
  { id: 30, name: 'Environment' },
  { id: 31, name: 'Climate' },
  { id: 32, name: 'Sustainability' },
  { id: 33, name: 'Food' },
  { id: 34, name: 'Cooking' },
  { id: 35, name: 'Sports' },
  { id: 36, name: 'Gaming' },
  { id: 37, name: 'Entertainment' },
  { id: 38, name: 'News' },
  { id: 39, name: 'Opinion' },
  { id: 40, name: 'Commentary' },
  { id: 41, name: 'Reviews' },
  { id: 42, name: 'Tutorials' },
  { id: 43, name: 'How-To' },
  { id: 44, name: 'Personal Development' },
  { id: 45, name: 'Career' },
  { id: 46, name: 'Productivity' },
  { id: 47, name: 'Lifestyle' },
  { id: 48, name: 'Relationships' },
  { id: 49, name: 'Parenting' },
  { id: 50, name: 'Fashion' },
  { id: 51, name: 'Beauty' },
  { id: 52, name: 'Home' },
  { id: 53, name: 'Gardening' },
  { id: 54, name: 'DIY' },
  { id: 55, name: 'Crafts' },
  { id: 56, name: 'Automotive' },
  { id: 57, name: 'Real Estate' },
  { id: 58, name: 'Law' },
  { id: 59, name: 'Government' },
  { id: 60, name: 'Social Issues' },
  { id: 61, name: 'Human Rights' },
  { id: 62, name: 'Activism' },
  { id: 63, name: 'Humor' },
  { id: 64, name: 'Satire' },
  { id: 65, name: 'Fiction' },
  { id: 66, name: 'Non-Fiction' },
  { id: 67, name: 'Biography' },
  { id: 68, name: 'Memoir' },
  { id: 69, name: 'Research' },
  { id: 70, name: 'Academic' },
  { id: 71, name: 'Medicine' },
  { id: 72, name: 'Engineering' },
  { id: 73, name: 'Mathematics' },
  { id: 74, name: 'Physics' },
  { id: 75, name: 'Chemistry' },
  { id: 76, name: 'Biology' },
  { id: 77, name: 'Astronomy' },
  { id: 78, name: 'Space' },
  { id: 79, name: 'Animals' },
  { id: 80, name: 'Pets' },
  { id: 81, name: 'True Crime' },
  { id: 82, name: 'Mystery' },
  { id: 83, name: 'Conspiracy' },
  { id: 84, name: 'Paranormal' },
  { id: 85, name: 'UFOs' },
  { id: 86, name: 'Mysteries' },
  { id: 87, name: 'Decentralization' },
  { id: 88, name: 'Blockchain' },
  { id: 89, name: 'Web3' },
  { id: 90, name: 'Privacy' },
  { id: 91, name: 'Security' },
  { id: 92, name: 'Cybersecurity' },
  { id: 93, name: 'AI' },
  { id: 94, name: 'Robotics' },
  { id: 95, name: 'Future' },
  { id: 96, name: 'Innovation' },
  { id: 97, name: 'Startups' },
  { id: 98, name: 'Entrepreneurship' },
  { id: 99, name: 'Other' },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: number): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get category name by ID
 */
export function getCategoryName(id: number): string {
  return getCategoryById(id)?.name || 'Unknown';
}
