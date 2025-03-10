export interface Category {
  id: number;
  name: string;
}

export interface Reel {
  id: number;
  shortcode: string;
  title: string;
  description?: string;
  videoUrl?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  postUrl?: string;
  ownerUsername?: string;
  likes: number;
  viewCount: number;
  commentCount: number;
  hashtags?: string;
  tags?: string;
  language: string;
  country?: string;
  category?: Category;
}

export type ReelCardProps = Reel;