interface GuestRecord {
  firstName: string;
  lastName: string;
  tags: string[];
}

let cache: GuestRecord[] | null = null;

function load(): GuestRecord[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(process.env.GUEST_LIST ?? "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

export function lookup(firstName: string, lastName: string): string[] | null {
  const guests = load();
  const match = guests.find(
    (g) =>
      g.firstName.toLowerCase() === firstName.toLowerCase() &&
      g.lastName.toLowerCase() === lastName.toLowerCase()
  );
  return match ? match.tags : null;
}
