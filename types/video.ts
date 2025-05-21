// types/video.ts
export interface RelatedResource {
  id: number;
  title: string;
  type: "pdf" | "video" | "exercise";
  duration?: string;
}

export interface VideoResource {
  id: number;
  title: string;
  subject: string;
  description: string;
  duration: string;
  videoUrl: string;
  tags: string[];
  difficulty: "Facile" | "Moyen" | "Difficile";
  relatedResources?: RelatedResource[];
}
