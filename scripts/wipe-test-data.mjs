/**
 * Wipe production test data. Keeps the hello@pawside.co admin account.
 *
 * Run locally with real keys:
 *   node scripts/wipe-test-data.mjs
 */
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAIL = "hello@pawside.co";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function usable(value) {
  return Boolean(value) && value.length > 20 && !value.includes("SENSITIVE");
}

if (!usable(url) || !usable(key)) {
  console.error("Missing or placeholder Supabase keys.");
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function count(table) {
  const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function deleteAll(table) {
  const { error } = await db.from(table).delete().gte("created_at", "1970-01-01");
  if (error) throw new Error(`delete ${table}: ${error.message}`);
}

const { data: usersPage, error: usersError } = await db.auth.admin.listUsers({ perPage: 1000 });
if (usersError) throw new Error(usersError.message);
const users = usersPage.users ?? [];
const admin = users.find((user) => (user.email ?? "").toLowerCase() === ADMIN_EMAIL);
if (!admin) {
  console.error(`Refusing to wipe: ${ADMIN_EMAIL} is not in Auth.`);
  process.exit(1);
}

console.log("before", {
  bookings: await count("bookings"),
  messages: await count("contact_messages"),
  pets: await count("pets"),
  profiles: await count("profiles"),
  authUsers: users.length,
  admin: admin.email,
});

await deleteAll("bookings");
await deleteAll("contact_messages");
await deleteAll("pets");

for (const user of users.filter((row) => (row.email ?? "").toLowerCase() !== ADMIN_EMAIL)) {
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) throw new Error(`delete user ${user.email}: ${error.message}`);
}

const { error: profileError } = await db.from("profiles").delete().neq("email", ADMIN_EMAIL);
if (profileError) throw new Error(profileError.message);

const { data: afterUsers, error: afterUsersError } = await db.auth.admin.listUsers({ perPage: 1000 });
if (afterUsersError) throw new Error(afterUsersError.message);

console.log("after", {
  bookings: await count("bookings"),
  messages: await count("contact_messages"),
  pets: await count("pets"),
  profiles: await count("profiles"),
  authUsers: (afterUsers.users ?? []).map((user) => user.email),
});
console.log("Kept admin", ADMIN_EMAIL);
