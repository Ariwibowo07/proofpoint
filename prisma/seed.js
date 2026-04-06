import { PrismaClient } from "@prisma/client";
import prismaConfig from "../prisma.config.js"; // pastikan pakai .js atau .ts sesuai setup
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient({
    adapter: prismaConfig.db.adapter,
    url: prismaConfig.db.url,
});

async function main() {
    const csvFilePath = path.resolve("./prisma/users.csv");
    const fileContent = fs.readFileSync(csvFilePath, "utf-8");

    const records = parse(fileContent, { columns: true, skip_empty_lines: true });

    for (const record of records) {
        await prisma.user.create({
            data: {
                email: record.email,
                password: record.password, // bisa diganti hash nanti
                full_name: record.full_name,
                job_title: record.job_title,
                department: record.department,
                role: record.role,
            },
        });
        console.log(`User ${record.full_name} berhasil dibuat`);
    }

    console.log("Semua user sudah di-seed!");
}

main().catch((e) => console.error(e)).finally(() => prisma.$disconnect());