import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // cek apakah ada answer
        const answers = await prisma.answer.findMany({
            where: { observationId: id }
        })

        if (answers.length === 0) {
            return NextResponse.json(
                { error: "Belum ada jawaban" },
                { status: 400 }
            )
        }

        const observation = await prisma.observation.update({
            where: { id },
            data: {
                status: "submitted",
                submittedAt: new Date()
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