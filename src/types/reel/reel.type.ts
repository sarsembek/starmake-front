export interface Category {
  id: number;
  name: string;
}

export type Reel = {
  id: number;
  shortcode: string;
  title: string;
  description: string;
  video_url: string;
  owner_username: string;
  file_url: string;
  language: string;
  country: string;
  view_count: number;
  comment_count: number;
  likes: number;
  thumbnail_url: string;
  post_url: string;
  hashtags: string;
  category_id: number;
  tags: string[];
  transcribed_text: string;
  repeat_instructions: string;
  improvement_suggestions: string;
  source: string;
  created_at: string;
  is_favorite: boolean;
}

export type ReelCardProps = Reel;