"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
            role: client_1.Role.GESTOR,
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
            role: client_1.Role.FUNCIONARIO,
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
            role: client_1.Role.FUNCIONARIO,
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
            role: client_1.Role.FUNCIONARIO,
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
    }
    else {
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
//# sourceMappingURL=seed.js.map