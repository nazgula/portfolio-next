export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface GalleryImage {
  file: string;
  caption: string;
}
