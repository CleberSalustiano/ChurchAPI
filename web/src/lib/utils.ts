import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatChurchScopeLabel(scope?: "GLOBAL" | "CHURCH") {
  if (scope === "GLOBAL") return "Visao global da sede";
  if (scope === "CHURCH") return "Visao local da igreja";
  return "Escopo em consolidacao";
}

export function formatAccessLabel(level?: "MEMBER" | "VIEWER" | "EDITOR") {
  if (level === "EDITOR") return "Editor";
  if (level === "VIEWER") return "Leitura";
  if (level === "MEMBER") return "Membro";
  return "Sem perfil";
}
