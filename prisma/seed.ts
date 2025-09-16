import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create a default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      nickname: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', adminUser);

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 'sample-post-1' },
    update: {},
    create: {
      id: 'sample-post-1',
      title: 'Welcome to NestJS with Prisma',
      content: 'This is a sample post created during database seeding.',
      published: true,
      authorId: adminUser.id,
    },
  });

  console.log('Created sample post:', post1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });