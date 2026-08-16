import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 10;
const REGISTRATION_NUMBER_LENGTH = 6;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminCount = await prisma.user.count({ where: { role: 'admin' } });

  if (adminCount > 0) {
    console.log('An admin user already exists, skipping seed.');
    return;
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@mes.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(9).toString('base64url');
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const registrationNumber = randomBytes(REGISTRATION_NUMBER_LENGTH)
    .toString('hex')
    .slice(0, REGISTRATION_NUMBER_LENGTH)
    .toUpperCase();

  await prisma.user.create({
    data: {
      name: 'Administrador',
      role: 'admin',
      email,
      password: hashedPassword,
      registrationNumber,
    },
  });

  console.log('Seed admin user created:');
  console.log(`  email:    ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`  password: ${password}`);
    console.log(
      '  (generated automatically — set SEED_ADMIN_PASSWORD to control this)',
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
