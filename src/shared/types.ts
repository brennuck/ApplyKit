export interface CustomField {
  label: string;
  value: string;
}

export interface Settings {
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  email: string;
  phone: string;
  autoPaste: boolean;
  autoFill: boolean;
  customFields: CustomField[];
}

export const DEFAULT_SETTINGS: Settings = {
  firstName: "",
  lastName: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  email: "",
  phone: "",
  autoPaste: false,
  autoFill: false,
  customFields: [],
};

export interface ResumeFile {
  name: string;
  type: string;
  dataUrl: string;
}

export interface CopyableField {
  label: string;
  value: string;
  icon: string;
}
