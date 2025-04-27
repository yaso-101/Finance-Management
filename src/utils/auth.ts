// src/utils/auth.ts

export async function signOut() {
  await fetch("http://localhost:3001/api/logout", {
    method: "POST",
    credentials: "include",
  });
}
