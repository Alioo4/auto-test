import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');
    await prisma.user.create({
        data: {
            phone: '998000000000',
            role: Role.SUPER_ADMIN,
            password: '$2b$12$wujnzdpdCsoupylLyVlZtubwRAX1j7ZYCSoEwlDgWBAUUn8wC1Q4m',
            name: 'Super Admin',
        }
    });                                        
    console.log('✅ Service va Endpoint lar yuklandi!');
}

main()
    .catch((e) => {
        console.error('❌ Xatolik:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
