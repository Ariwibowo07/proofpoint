import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const { observationId, indicatorId, score, note, evidence } = body

        const existing = await prisma.observationAnswer.findFirst({
            where: {
                observationId,
                indicatorId
            }
        })

        let result

        if (existing) {
            result = await prisma.observationAnswer.update({
                where: {
                    id: existing.id
                },
                data: {
                    score,
                    note,
                    evidence
                }
            })
        } else {
            result = await prisma.observationAnswer.create({
                data: {
                    observationId,
                    indicatorId,
                    score,
                    note,
                    evidence
                }
            })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to save answer" }, { status: 500 })
    }
}