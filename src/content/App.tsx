import { useEffect, useRef, useState } from "react";
import { getSettings, getResumeFile, onSettingsChanged, dataUrlToFile } from "../shared/storage";
import { DEFAULT_SETTINGS } from "../shared/types";
import type { CopyableField, ResumeFile, Settings } from "../shared/types";

const LABELS: Record<string, string> = {
  firstName: "First Name",
  lastName: "Last Name",
  fullName: "Full Name",
  linkedinUrl: "LinkedIn",
  githubUrl: "GitHub",
  portfolioUrl: "Portfolio",
  email: "Email",
  phone: "Phone",
};

const COLORS: Record<string, { bg: string; hover: string }> = {
  firstName: { bg: "bg-sky-500", hover: "hover:bg-sky-600" },
  lastName: { bg: "bg-sky-500", hover: "hover:bg-sky-600" },
  fullName: { bg: "bg-sky-600", hover: "hover:bg-sky-700" },
  linkedinUrl: { bg: "bg-[#0A66C2]", hover: "hover:bg-[#004182]" },
  githubUrl: { bg: "bg-[#24292f]", hover: "hover:bg-[#171a1f]" },
  portfolioUrl: { bg: "bg-violet-600", hover: "hover:bg-violet-700" },
  email: { bg: "bg-rose-500", hover: "hover:bg-rose-600" },
  phone: { bg: "bg-emerald-500", hover: "hover:bg-emerald-600" },
  resume: { bg: "bg-amber-500", hover: "hover:bg-amber-600" },
};

const DEFAULT_COLOR = { bg: "bg-zinc-800", hover: "hover:bg-zinc-900" };

function PersonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CustomIcon({ letter }: { letter: string }) {
  return <span className="text-lg font-bold leading-none">{letter}</span>;
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const ICON_COMPONENTS: Record<string, () => React.ReactNode> = {
  firstName: PersonIcon,
  lastName: PersonIcon,
  fullName: PersonIcon,
  linkedinUrl: LinkedInIcon,
  githubUrl: GitHubIcon,
  portfolioUrl: PortfolioIcon,
  email: EmailIcon,
  phone: PhoneIcon,
};

interface FieldEntry extends CopyableField {
  colorKey: string;
}

function buildFields(settings: Settings): FieldEntry[] {
  const fields: FieldEntry[] = [];

  const keys = ["linkedinUrl", "githubUrl", "portfolioUrl", "email", "phone"] as const;
  for (const key of keys) {
    if (settings[key]) {
      fields.push({ label: LABELS[key], value: settings[key], icon: key, colorKey: key });
    }
  }

  for (const cf of settings.customFields) {
    if (cf.label && cf.value) {
      fields.push({ label: cf.label, value: cf.value, icon: cf.label.charAt(0).toUpperCase(), colorKey: "custom" });
    }
  }

  return fields;
}

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const setter =
    Object.getOwnPropertyDescriptor(
      el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
      "value",
    )?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

type MatcherKey = keyof Omit<Settings, "customFields" | "autoPaste" | "autoFill">;

interface FieldMatcher {
  key: MatcherKey;
  patterns: RegExp;
  antiPatterns?: RegExp;
}

const FIELD_MATCHERS: FieldMatcher[] = [
  { key: "firstName", patterns: /\b(first[-_\s]?name|given[-_\s]?name|fname)\b/i, antiPatterns: /\b(last|sur|family)\b/i },
  { key: "lastName", patterns: /\b(last[-_\s]?name|sur[-_\s]?name|family[-_\s]?name|lname)\b/i, antiPatterns: /\b(first|given)\b/i },
  { key: "email", patterns: /\be[-_]?mail\b/i },
  { key: "phone", patterns: /\b(phone|telephone|mobile|cell[-_\s]?phone)\b/i },
  { key: "linkedinUrl", patterns: /\blinkedin\b/i },
  { key: "githubUrl", patterns: /\bgithub\b/i },
  { key: "portfolioUrl", patterns: /\b(portfolio|personal[-_\s]?(site|web|url|page)|website)\b/i },
];

function getInputSignals(el: HTMLInputElement | HTMLTextAreaElement): string {
  const parts = [
    el.name,
    el.id,
    el.placeholder,
    el.getAttribute("aria-label") ?? "",
    el.getAttribute("autocomplete") ?? "",
  ];
  const label = el.labels?.[0]?.textContent ?? "";
  const ariaLabelledBy = el.getAttribute("aria-labelledby");
  if (ariaLabelledBy) {
    const labelEl = document.getElementById(ariaLabelledBy);
    if (labelEl) parts.push(labelEl.textContent ?? "");
  }
  parts.push(label);
  return parts.join(" ");
}

const FULL_NAME_PATTERN = /\bfull[-_\s]?name\b|^name$/i;
const GENERIC_NAME_PATTERN = /\bname\b/i;
const NAME_QUALIFIER_PATTERN = /first|last|sur|given|family|middle|user|company|org|file|host|domain/i;

function autoFillInputs(settings: Settings) {
  const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input:not([type]), textarea',
  );

  const fullName = [settings.firstName, settings.lastName].filter(Boolean).join(" ");
  const filled = new Set<HTMLElement>();

  inputs.forEach((input) => {
    if (input.value) return;
    if (filled.has(input)) return;

    const signals = getInputSignals(input);

    for (const { key, patterns, antiPatterns } of FIELD_MATCHERS) {
      if (settings[key] && patterns.test(signals) && (!antiPatterns || !antiPatterns.test(signals))) {
        setNativeValue(input, settings[key]);
        filled.add(input);
        return;
      }
    }

    if (fullName && (FULL_NAME_PATTERN.test(signals) || (GENERIC_NAME_PATTERN.test(signals) && !NAME_QUALIFIER_PATTERN.test(signals)))) {
      setNativeValue(input, fullName);
      filled.add(input);
    }
  });
}

function useAutoFill(enabled: boolean, settings: Settings) {
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (!enabled) return;

    const run = () => autoFillInputs(settingsRef.current);

    const timeout = setTimeout(run, 500);

    const observer = new MutationObserver(() => {
      setTimeout(run, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [enabled]);
}

function CopyButton({ field, autoPaste }: { field: FieldEntry; autoPaste: boolean }) {
  const [copied, setCopied] = useState(false);
  const color = COLORS[field.colorKey] ?? DEFAULT_COLOR;
  const IconComponent = ICON_COMPONENTS[field.colorKey];

  const handleCopy = async () => {
    const activeEl = document.activeElement as HTMLElement | null;
    const isInput =
      activeEl &&
      (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

    if (autoPaste && isInput) {
      if (activeEl.isContentEditable) {
        document.execCommand("insertText", false, field.value);
      } else {
        setNativeValue(activeEl as HTMLInputElement | HTMLTextAreaElement, field.value);
      }
    }

    try {
      await navigator.clipboard.writeText(field.value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = field.value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault();

  return (
    <button
      onMouseDown={preventFocusSteal}
      onClick={handleCopy}
      title={autoPaste ? `Paste ${field.label} into focused input` : `Copy ${field.label}`}
      className={`
        w-[56px] h-[56px] rounded-2xl flex items-center justify-center
        shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-pointer text-white
        transition-all duration-200 ease-out
        ${copied
          ? "bg-emerald-500 scale-[0.88]"
          : `${color.bg} ${color.hover} hover:scale-[1.08] hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] active:scale-95`
        }
      `}
    >
      {copied ? <CheckIcon /> : IconComponent ? <IconComponent /> : <CustomIcon letter={field.icon} />}
    </button>
  );
}

function findNearestFileInput(x: number, y: number): HTMLInputElement | null {
  const inputs = document.querySelectorAll('input[type="file"]');
  let best: HTMLInputElement | null = null;
  let bestDist = 300;

  inputs.forEach((input) => {
    const el = input as HTMLInputElement;
    const rect = el.getBoundingClientRect();
    const effectiveEl = rect.width === 0 || rect.height === 0 ? el.parentElement : el;
    if (!effectiveEl) return;
    const r = effectiveEl.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist < bestDist) {
      bestDist = dist;
      best = el;
    }
  });

  return best;
}

function injectFile(file: File, target: HTMLElement) {
  const fileInput =
    (target.tagName === "INPUT" && (target as HTMLInputElement).type === "file"
      ? target
      : target.querySelector('input[type="file"]')
        ?? target.closest("label, form, [class*='upload'], [class*='file'], [class*='drop']")?.querySelector('input[type="file"]')
    ) as HTMLInputElement | null;

  if (fileInput) {
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event("input", { bubbles: true }));
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  return false;
}

function ResumeButton({ resume }: { resume: ResumeFile }) {
  const [dragging, setDragging] = useState(false);
  const [dropped, setDropped] = useState(false);
  const fileRef = useRef<File | null>(null);

  useEffect(() => {
    fileRef.current = dataUrlToFile(resume.dataUrl, resume.name, resume.type);
  }, [resume]);

  useEffect(() => {
    if (!dragging || !fileRef.current) return;
    const file = fileRef.current;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      let success = injectFile(file, target);

      if (!success) {
        const nearest = findNearestFileInput(e.clientX, e.clientY);
        if (nearest) success = injectFile(file, nearest);
      }

      if (!success) {
        const dropZone = target.closest('[class*="upload"], [class*="dropzone"], [class*="drop-zone"], [class*="file-drop"], [class*="drag"]');
        if (dropZone) {
          const dt = new DataTransfer();
          dt.items.add(file);
          dropZone.dispatchEvent(
            new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: dt }),
          );
          success = true;
        }
      }

      if (success) {
        setDropped(true);
        setTimeout(() => setDropped(false), 1500);
      }
    };

    document.addEventListener("dragover", handleDragOver, true);
    document.addEventListener("drop", handleDrop, true);

    return () => {
      document.removeEventListener("dragover", handleDragOver, true);
      document.removeEventListener("drop", handleDrop, true);
    };
  }, [dragging]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!fileRef.current) return;
    e.dataTransfer.setData("text/plain", "applykit-resume");
    e.dataTransfer.effectAllowed = "copy";
    setDragging(true);
  };

  const handleDragEnd = () => setDragging(false);

  const color = COLORS.resume;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`Drag to upload: ${resume.name}`}
      className={`
        w-[56px] h-[56px] rounded-2xl flex items-center justify-center
        shadow-[0_2px_12px_rgba(0,0,0,0.15)] text-white select-none
        transition-all duration-200 ease-out
        ${dropped
          ? "bg-emerald-500 scale-[0.88]"
          : dragging
            ? "bg-amber-400 scale-[0.88] cursor-grabbing"
            : `${color.bg} ${color.hover} hover:scale-[1.08] hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] cursor-grab`
        }
      `}
    >
      {dropped ? <CheckIcon /> : dragging ? <DownloadIcon /> : <ResumeIcon />}
    </div>
  );
}

export default function App() {
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [resume, setResume] = useState<ResumeFile | null>(null);

  useEffect(() => {
    getSettings().then((s) => {
      setFields(buildFields(s));
      setSettings(s);
    });
    getResumeFile().then(setResume);
    const unsub = onSettingsChanged((s) => {
      setFields(buildFields(s));
      setSettings(s);
    });
    return unsub;
  }, []);

  useAutoFill(settings.autoFill, settings);

  const hasResume = resume !== null;

  if (fields.length === 0 && !hasResume) return null;

  return (
    <div className="fixed left-0 z-[2147483647] flex flex-col gap-2.5 pl-3"
      style={{ top: "50%", transform: "translateY(-50%)", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {fields.map((f) => (
        <CopyButton key={f.label} field={f} autoPaste={settings.autoPaste} />
      ))}
      {hasResume && <ResumeButton resume={resume} />}
    </div>
  );
}
