import prisma from "@/lib/prisma"

export async function createAIConversation(userId: string, message: string, response: unknown, title?: string) {
  return await prisma.aIConversation.create({
    data: {
      userId,
      message,
      response: JSON.parse(JSON.stringify(response)),
      title,
    },
  })
}

export async function getRecentAIConversations(userId: string, limit: number = 10) {
  return await prisma.aIConversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}
