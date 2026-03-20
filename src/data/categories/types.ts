export interface Topic {
  id: string;
  name: { vi: string; en: string };
  subtopics?: Topic[];
  expanded?: boolean;
}

export interface Category {
  id: string;
  name: { vi: string; en: string };
  description: { vi: string; en: string };
  icon: string;
  topics: Topic[];
}
