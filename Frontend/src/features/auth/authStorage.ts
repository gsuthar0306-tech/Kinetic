export type StoredAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

const ACCOUNTS_KEY = "kinetic-account";

export function getStoredAccounts(): StoredAccount[] {
  const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);

  if (!storedAccounts) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedAccounts);

    if (!Array.isArray(parsed)) {
      throw new Error("Stored accounts must be an array.");
    }

    return parsed.filter(isStoredAccount);
  } catch {
    localStorage.removeItem(ACCOUNTS_KEY);
    return [];
  }
}

export function saveStoredAccounts(accounts: StoredAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (!value || typeof value !== "object") {
    return false;
  }

  const account = value as Record<string, unknown>;

  return (
    typeof account.id === "string" &&
    typeof account.name === "string" &&
    typeof account.email === "string" &&
    typeof account.password === "string"
  );
}
