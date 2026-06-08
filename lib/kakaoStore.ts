import { Analysis } from "@/lib/kakao";

export interface SavedAnalysis {
  id: string;
  fileName: string;
  savedAt: number;     // timestamp
  analysis: Analysis;
}

const KEY = "our1000days-kakao";

export function loadAnalyses(): SavedAnalysis[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function saveAnalysis(fileName: string, analysis: Analysis): SavedAnalysis {
  const item: SavedAnalysis = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, fileName, savedAt: Date.now(), analysis };
  const list = [item, ...loadAnalyses()].slice(0, 20); // 최대 20개 보관
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  return item;
}

export function deleteAnalysis(id: string): SavedAnalysis[] {
  const list = loadAnalyses().filter((a) => a.id !== id);
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
  return list;
}

export function clearAnalyses() {
  try { localStorage.removeItem(KEY); } catch {}
}
