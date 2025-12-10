export interface WordItem {
  word: string;
  weight: number;
}

export interface AnalyzeResponse {
  words: WordItem[];
}
