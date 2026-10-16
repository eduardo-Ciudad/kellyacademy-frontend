export type LegalDoc = {
  title: string;
  description: string;
  updatedAt: string;
  intro?: string;
  sections: {
    id: string;
    title: string;
    paragraphs: string[];
    items?: string[];
    closing?: string[];
  }[];
};
