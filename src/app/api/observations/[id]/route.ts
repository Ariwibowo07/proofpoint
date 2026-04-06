import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET BY ID
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params

        const observation = await prisma.observation.findUnique({
            where: { id },
            include: {
                staff: true,
                manager: true,
                director: true,
                template: true,
                answers: true
            }
        })

        if (!observation) {
            return NextResponse.json(
                { error: "Observation not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(observation)
    } catch (error: any) {
        console.error(error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}