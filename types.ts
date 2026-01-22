
export enum Platform {
  TIKTOK = 'TikTok',
  FACEBOOK = 'Facebook',
  YOUTUBE = 'YouTube',
  UNKNOWN = 'Unknown'
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration?: string;
  author: string;
  platform: Platform;
}

export interface DownloadOption {
  quality: string;
  format: 'MP4' | 'MP3';
  size: string;
  url: string;
  noWatermark: boolean;
}

export interface TranscriptResult {
  text: string;
  language: string;
  confidence: number;
}
