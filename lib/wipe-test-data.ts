import { createServiceSupabase } from "@/lib/supabase/server";

const ADMIN_EMAIL = "hello@pawside.co";

async function count(db: NonNullable<ReturnType<typeof createServiceSupabase>>, table: string) {
  const { count, error } = await db.from(table).select("*", { count: "exact", head: true });
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function deleteAll(db: NonNullable<ReturnType<typeof createServiceSupabase>>, table: string) {
  const { error } = await db.from(table).delete().gte("created_at", "1970-01-01");
  if (error) throw new Error(`delete ${table}: ${error.message}`);
}

export async function wipeTestData() {
  const db = createServiceSupabase();
  if (!db) throw new Error("Supabase isn’t connected.");

  const { data: usersPage, error: usersError } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (usersError) throw new Error(usersError.message);
  const users = usersPage.users ?? [];
  const admin = users.find((user) => (user.email ?? "").toLowerCase() === ADMIN_EMAIL);
  if (!admin) throw new Error(`Refusing to wipe: ${ADMIN_EMAIL} is not in Auth.`);

  const extraUsers = users.filter((user) => (user.email ?? "").toLowerCase() !== ADMIN_EMAIL);
  const before = {
    bookings: await count(db, "bookings"),
    messages: await count(db, "contact_messages"),
    pets: await count(db, "pets"),
    profiles: await count(db, "profiles"),
    authUsers: users.length,
  };

  await deleteAll(db, "bookings");
  await deleteAll(db, "contact_messages");
  await deleteAll(db, "pets");

  for (const user of extraUsers) {
    const { error } = await db.auth.admin.deleteUser(user.id);
    if (error) throw new Error(`delete user ${user.email}: ${error.message}`);
  }

  const { error: profileError } = await db.from("profiles").delete().neq("email", ADMIN_EMAIL);
  if (profileError) throw new Error(profileError.message);

  const { data: afterUsers, error: afterUsersError } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (afterUsersError) throw new Error(afterUsersError.message);
  const remaining = (afterUsers.users ?? []).map((user) => user.email?.toLowerCase() ?? "");
  if (remaining.length !== 1 || remaining[0] !== ADMIN_EMAIL) {
    throw new Error("Admin account check failed after wipe.");
  }

  return {
    before,
    after: {
      bookings: await count(db, "bookings"),
      messages: await count(db, "contact_messages"),
      pets: await count(db, "pets"),
      profiles: await count(db, "profiles"),
      authUsers: remaining,
    },
    kept: ADMIN_EMAIL,
  };
}
