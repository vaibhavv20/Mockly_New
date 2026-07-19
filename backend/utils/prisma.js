const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

let connectionString = process.env.DATABASE_URL;
if (connectionString && connectionString.startsWith('prisma+postgres://')) {
    try {
        const url = new URL(connectionString);
        const apiKey = url.searchParams.get('api_key');
        if (apiKey) {
            const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
            const parsed = JSON.parse(decoded);
            if (parsed.databaseUrl) {
                connectionString = parsed.databaseUrl;
            }
        }
    } catch (e) {
        console.error("Failed to parse Prisma Postgres URL:", e);
    }
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

module.exports = prisma;
