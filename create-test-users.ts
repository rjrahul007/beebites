// scripts/create-test-users.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createUser(
  email: string,
  password: string,
  role: string,
  fullName: string
) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) throw error;

  // insert profile
  await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    role, // ENUM → 'KITCHEN' | 'DELIVERY'
    is_admin: false,
  });

  console.log(`Created ${role}: ${email}`);
}

async function main() {
  await createUser(
    "kitchen1@beebites.in",
    "Kitchen@123",
    "KITCHEN",
    "Ravi Kumar"
  );

  await createUser(
    "kitchen2@beebites.in",
    "Kitchen@123",
    "KITCHEN",
    "Amit Sharma"
  );

  await createUser(
    "delivery1@beebites.in",
    "Delivery@123",
    "DELIVERY",
    "Suresh Yadav"
  );

  await createUser(
    "delivery2@beebites.in",
    "Delivery@123",
    "DELIVERY",
    "Mohan Verma"
  );
}

main().catch(console.error);
