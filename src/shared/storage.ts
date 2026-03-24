import { DEFAULT_SETTINGS, type ResumeFile, type Settings } from "./types";

const STORAGE_KEY = "applykit_settings";
const RESUME_KEY = "applykit_resume";

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const stored = (result[STORAGE_KEY] as Partial<Settings> | undefined) ?? {};
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}

export function onSettingsChanged(
  callback: (settings: Settings) => void,
): () => void {
  const listener = (changes: Record<string, chrome.storage.StorageChange>) => {
    if (changes[STORAGE_KEY]) {
      const newVal = (changes[STORAGE_KEY].newValue as Partial<Settings> | undefined) ?? {};
      callback({ ...DEFAULT_SETTINGS, ...newVal });
    }
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}

export async function getResumeFile(): Promise<ResumeFile | null> {
  const result = await chrome.storage.local.get(RESUME_KEY);
  return (result[RESUME_KEY] as ResumeFile | undefined) ?? null;
}

export async function saveResumeFile(file: ResumeFile | null): Promise<void> {
  if (file) {
    await chrome.storage.local.set({ [RESUME_KEY]: file });
  } else {
    await chrome.storage.local.remove(RESUME_KEY);
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function dataUrlToFile(dataUrl: string, name: string, type: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? type;
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], name, { type: mime });
}
