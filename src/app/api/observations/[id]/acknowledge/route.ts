import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const observation = await prisma.observation.update({
            where: { id },
            data: {
                status: "acknowledged",
                acknowledgedAt: new Date()
            }
        })

        return NextResponse.json(observation)
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}