import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  const gestor = await prisma.user.upsert({
    where: { email: 'gestor@empresa.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Gestor Principal',
      email: 'gestor@empresa.com',
      password: hashedPassword,
      role: Role.GESTOR,
      points: 0,
    },
  });

  const ana = await prisma.user.upsert({
    where: { email: 'ana@empresa.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Ana Silva',
      email: 'ana@empresa.com',
      password: hashedPassword,
      role: Role.FUNCIONARIO,
      points: 120,
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: 'bruno@empresa.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Bruno Souza',
      email: 'bruno@empresa.com',
      password: hashedPassword,
      role: Role.FUNCIONARIO,
      points: 90,
    },
  });

  const carla = await prisma.user.upsert({
    where: { email: 'carla@empresa.com' },
    update: { password: hashedPassword },
    create: {
      name: 'Carla Mendes',
      email: 'carla@empresa.com',
      password: hashedPassword,
      role: Role.FUNCIONARIO,
      points: 150,
    },
  });

  console.log(`Senhas atualizadas para: ${gestor.name}, ${ana.name}, ${bruno.name}, ${carla.name}`);

  const missionCount = await prisma.mission.count();
  if (missionCount === 0) {
    await prisma.mission.createMany({
      data: [
        {
          title: 'Concluir treinamento semanal',
          description: 'Finalizar o treinamento obrigatório da semana',
          points: 50,
          active: true,
        },
        {
          title: 'Bater meta individual',
          description: 'Atingir a meta definida pelo gestor',
          points: 100,
          active: true,
        },
        {
          title: 'Ajudar um colega da equipe',
          description: 'Colaborar com outro funcionário em uma tarefa',
          points: 30,
          active: true,
        },
      ],
    });
    console.log('3 missões criadas.');
  } else {
    console.log(`Missões já existem (${missionCount}). Pulando criação.`);
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
