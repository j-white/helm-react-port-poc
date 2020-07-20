export interface Identifiable {
  id: string;
}

export function matchById(identifiable: Identifiable): (candidate: Identifiable) => boolean {
  return candidate => candidate.id === identifiable.id;
}

export function excludeById(identifiable: Identifiable): (candidate: Identifiable) => boolean {
  return candidate => candidate.id !== identifiable.id;
}
