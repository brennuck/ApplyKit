import { useEffect, useRef, useState } from "react";
import { getSettings, saveSettings, getResumeFile, saveResumeFile, fileToDataUrl } from "../shared/storage";
import type { CustomField, Settings, ResumeFile } from "../shared/types";
import { DEFAULT_SETTINGS } from "../shared/types";
import iconUrl from "../assets/icon128.png";

const BRAND = "#5B8769";

const PERSON_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FIELD_CONFIG: { key: keyof Omit<Settings, "customFields" | "autoPaste" | "autoFill">; label: string; placeholder: string; iconColor: string; icon: React.ReactNode }[] = [
  {
    key: "firstName",
    label: "First Name",
    placeholder: "John",
    iconColor: "#0ea5e9",
    icon: PERSON_ICON,
  },
  {
    key: "lastName",
    label: "Last Name",
    placeholder: "Doe",
    iconColor: "#0ea5e9",
    icon: PERSON_ICON,
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/yourname",
    iconColor: "#0A66C2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: "githubUrl",
    label: "GitHub",
    placeholder: "https://github.com/yourname",
    iconColor: "#24292f",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    key: "portfolioUrl",
    label: "Portfolio",
    placeholder: "https://yourportfolio.com",
    iconColor: "#7c3aed",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email",
    placeholder: "you@example.com",
    iconColor: "#f43f5e",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "(555) 123-4567",
    iconColor: "#10b981",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium flex items-center gap-2"
      style={{ backgroundColor: BRAND }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {message}
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [savedSettings, setSavedSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savedResumeName, setSavedResumeName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasChanges =
    JSON.stringify(settings) !== JSON.stringify(savedSettings) || (resumeFile?.name ?? null) !== savedResumeName;

  useEffect(() => {
    Promise.all([getSettings(), getResumeFile()]).then(([s, r]) => {
      setSettings(s);
      setSavedSettings(s);
      setResumeFile(r);
      setSavedResumeName(r?.name ?? null);
      setLoaded(true);
    });
  }, []);

  const formatPhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const updateField = (key: keyof Omit<Settings, "customFields" | "autoPaste" | "autoFill">, value: string) => {
    const formatted = key === "phone" ? formatPhone(value) : value;
    setSettings((prev) => ({ ...prev, [key]: formatted }));
  };

  const addCustomField = () => {
    setSettings((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { label: "", value: "" }],
    }));
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.map((cf, i) => (i === index ? { ...cf, ...field } : cf)),
    }));
  };

  const removeCustomField = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const rf: ResumeFile = { name: file.name, type: file.type, dataUrl };
    setResumeFile(rf);
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    await Promise.all([saveSettings(settings), saveResumeFile(resumeFile)]);
    setSavedSettings(structuredClone(settings));
    setSavedResumeName(resumeFile?.name ?? null);
    setToast("Settings saved");
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="w-5 h-5 border-2 border-[#c8d9cd] rounded-full animate-spin" style={{ borderTopColor: BRAND }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-xl mx-auto py-16 px-5">

        <div className="mb-14 text-center">
          <img src={iconUrl} alt="ApplyKit" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-sm" />
          <h1 className="text-2xl font-extrabold text-[#2d3e32] tracking-tight">ApplyKit</h1>
          <p className="text-[#8fa896] text-sm mt-1">Your clipboard, supercharged for applications.</p>
        </div>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: BRAND }}>Quick Copy Links</h2>
          <div className="space-y-3">
            {FIELD_CONFIG.map(({ key, label, placeholder, icon, iconColor }) => (
              <div
                key={key}
                className="group flex items-center gap-3 bg-white rounded-xl border border-[#dfe8e1] px-4 py-3 focus-within:border-[#a3bfa8] focus-within:shadow-sm transition-all"
              >
                <div className="shrink-0 w-8 h-8 rounded-lg bg-[#eef3ef] flex items-center justify-center" style={{ color: iconColor }}>
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-semibold text-[#8fa896] uppercase tracking-wide mb-0.5">{label}</label>
                  <input
                    type="text"
                    value={settings[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full text-sm text-[#2d3e32] placeholder:text-[#c3d1c6] bg-transparent outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: BRAND }}>Preferences</h2>
          <div className="bg-white rounded-xl border border-[#dfe8e1] px-4 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#2d3e32]">Auto-paste</p>
                <p className="text-xs text-[#8fa896] mt-0.5">Click a button to paste directly into the focused input</p>
              </div>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, autoPaste: !prev.autoPaste }))}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  settings.autoPaste ? "" : "bg-[#dfe8e1]"
                }`}
                style={settings.autoPaste ? { backgroundColor: BRAND } : undefined}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.autoPaste ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
            <div className="border-t border-[#eef3ef]" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#2d3e32]">Auto-fill</p>
                <p className="text-xs text-[#8fa896] mt-0.5">Automatically fill matching inputs on the page (email, phone, etc.)</p>
              </div>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, autoFill: !prev.autoFill }))}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                  settings.autoFill ? "" : "bg-[#dfe8e1]"
                }`}
                style={settings.autoFill ? { backgroundColor: BRAND } : undefined}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.autoFill ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: BRAND }}>Resume</h2>
          <div className="bg-white rounded-xl border border-[#dfe8e1] p-5">
            <p className="text-xs text-[#8fa896] mb-4">Upload your resume to drag & drop it directly into file inputs on job sites.</p>
            {resumeFile ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-3 bg-[#eef3ef] border border-[#dfe8e1] rounded-lg px-4 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: BRAND + "20", color: BRAND }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2d3e32] truncate">{resumeFile.name}</p>
                    <p className="text-[11px] text-[#8fa896]">Ready to drag & drop</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveResume}
                  className="shrink-0 w-9 h-9 rounded-lg border border-[#dfe8e1] flex items-center justify-center text-[#8fa896] hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                  title="Remove resume"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#c8d9cd] rounded-xl py-6 cursor-pointer hover:border-[#a3bfa8] hover:bg-[#f4f7f5] transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: BRAND }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-sm font-medium" style={{ color: BRAND }}>Upload resume</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: BRAND }}>Custom Fields</h2>
            <button
              onClick={addCustomField}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[#2d3e32] bg-[#dfe8e1] hover:bg-[#c8d9cd]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </button>
          </div>

          {settings.customFields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-[#c8d9cd] rounded-xl">
              <p className="text-sm text-[#b3c7b7]">No custom fields yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settings.customFields.map((cf, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#dfe8e1] p-4 flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ backgroundColor: BRAND }}>
                    {cf.label ? cf.label.charAt(0).toUpperCase() : "#"}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <input
                      type="text"
                      value={cf.label}
                      onChange={(e) => updateCustomField(i, { label: e.target.value })}
                      placeholder="Label"
                      className="w-full text-sm font-medium text-[#2d3e32] placeholder:text-[#c3d1c6] bg-transparent outline-none"
                    />
                    <input
                      type="text"
                      value={cf.value}
                      onChange={(e) => updateCustomField(i, { value: e.target.value })}
                      placeholder="Value to copy"
                      className="w-full text-xs text-[#6b8a70] placeholder:text-[#c3d1c6] bg-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeCustomField(i)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#b3c7b7] hover:text-red-500 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`w-full font-semibold py-3.5 rounded-xl transition-colors text-sm tracking-wide ${
            hasChanges ? "text-white cursor-pointer" : "bg-[#dfe8e1] text-[#a3bfa8] cursor-not-allowed"
          }`}
          style={hasChanges ? { backgroundColor: BRAND } : undefined}
          onMouseEnter={(e) => { if (hasChanges) e.currentTarget.style.backgroundColor = "#4d7a5b"; }}
          onMouseLeave={(e) => { if (hasChanges) e.currentTarget.style.backgroundColor = BRAND; }}
        >
          {hasChanges ? "Save Settings" : "No changes"}
        </button>

        <p className="text-center text-[11px] text-[#b3c7b7] mt-6">ApplyKit v2</p>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
