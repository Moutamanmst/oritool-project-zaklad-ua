import { PrismaClient, UserRole } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Creating admin user...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@zaklad.ua" },
  });

  if (existingAdmin) {
    console.log("  ⏭️  Admin already exists");
    return;
  }

  const hashedPassword = await bcryptjs.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      email: "admin@zaklad.ua",
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });

  // Create profile
  await prisma.userProfile.create({
    data: {
      userId: user.id,
      firstName: "Адмін",
      lastName: "ZakladUA",
    },
  });

  console.log("  ✅ Admin created!");
  console.log("");
  console.log("📧 Email: admin@zaklad.ua");
  console.log("🔑 Password: admin123");
  console.log("");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
