import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json()

        const staffId = body.staffId?.trim()
        const managerId = body.managerId?.trim()
        const templateId = body.templateId?.trim()

        // 🔥 ambil director dari manager
        const manager = await prisma.user.findUnique({
            where: { id: managerId },
            include: {
                director: true // pastikan relasi ini ada di schema
            }
        })

        const directorId = manager?.director?.id

        const observation = await prisma.observation.create({
            data: {
                staffId,
                managerId,
                directorId: manager?.director?.id || null,
                templateId,
                status: "draft"
            }
        })

        return NextResponse.json(observation)
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// GET
export async function GET(req: Request) {
    try {
        const observations = await prisma.observation.findMany({
            include: {
                staff: true,
                manager: true,
                template: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(observations)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}