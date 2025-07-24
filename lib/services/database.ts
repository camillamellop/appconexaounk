import { prisma } from "@/lib/prisma"
import { cache, CACHE_KEYS } from "@/lib/cache"

export class DatabaseService {
  // ===== USUÁRIOS =====
  static async getUsuarios() {
    const cacheKey = CACHE_KEYS.USERS
    let users = cache.get(cacheKey)

    if (!users) {
      users = await prisma.usuarios.findMany({
        orderBy: { created_at: "desc" },
      })
      cache.set(cacheKey, users, 5 * 60 * 1000) // 5 min cache
    }

    return users
  }

  static async getUsuarioById(id: number) {
    return prisma.usuarios.findUnique({
      where: { id },
      include: {
        brandings: true,
        projetos: {
          include: { tarefas: true },
        },
      },
    })
  }

  static async getUsuarioByEmail(email: string) {
    const cacheKey = CACHE_KEYS.USER_BY_EMAIL(email)
    let user = cache.get(cacheKey)

    if (!user) {
      user = await prisma.usuarios.findUnique({
        where: { email },
      })
      if (user) {
        cache.set(cacheKey, user, 10 * 60 * 1000) // 10 min cache
      }
    }

    return user
  }

  static async createUsuario(data: any) {
    const user = await prisma.usuarios.create({
      data,
    })

    // Invalidate cache
    cache.delete(CACHE_KEYS.USERS)

    return user
  }

  static async updateUsuario(id: number, data: any) {
    const user = await prisma.usuarios.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    // Invalidate caches
    cache.delete(CACHE_KEYS.USERS)
    if (user.email) {
      cache.delete(CACHE_KEYS.USER_BY_EMAIL(user.email))
    }

    return user
  }

  // ===== AGENDA =====
  static async getAgendaByUser(userId: number, date?: string) {
    const cacheKey = CACHE_KEYS.AGENDA_BY_USER(userId)

    const whereClause: any = { usuario_id: userId }
    if (date) {
      whereClause.data_evento = {
        gte: new Date(date + "T00:00:00"),
        lt: new Date(date + "T23:59:59"),
      }
    }

    return prisma.agenda.findMany({
      where: whereClause,
      orderBy: { data_evento: "asc" },
    })
  }

  static async createAgendaEvent(data: any) {
    const event = await prisma.agenda.create({
      data,
    })

    // Invalidate user's agenda cache
    cache.delete(CACHE_KEYS.AGENDA_BY_USER(data.usuario_id))

    return event
  }

  // ===== TAREFAS =====
  static async getTarefasByUser(userId: number) {
    return prisma.tarefas.findMany({
      where: { usuario_id: userId },
      include: {
        projeto: {
          select: { nome: true },
        },
      },
      orderBy: [{ status: "asc" }, { prioridade: "desc" }, { created_at: "desc" }],
    })
  }

  static async createTarefa(data: any) {
    const task = await prisma.tarefas.create({
      data,
    })

    cache.delete(CACHE_KEYS.TASKS_BY_USER(data.usuario_id))

    return task
  }

  static async updateTarefa(id: number, data: any) {
    const task = await prisma.tarefas.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    })

    cache.delete(CACHE_KEYS.TASKS_BY_USER(task.usuario_id))

    return task
  }

  // ===== TRANSAÇÕES =====
  static async getTransacoesByUser(userId: number, limit = 50) {
    return prisma.transacoes.findMany({
      where: { usuario_id: userId },
      orderBy: { data: "desc" },
      take: limit,
    })
  }

  static async createTransacao(data: any) {
    const transaction = await prisma.transacoes.create({
      data,
    })

    cache.delete(CACHE_KEYS.TRANSACTIONS_BY_USER(data.usuario_id))

    return transaction
  }

  // ===== RELATÓRIOS/STATS =====
  static async getUserStats(userId: number) {
    const [totalTarefas, tarefasPendentes, tarefasConcluidas, eventosProximos, transacoesRecentes] = await Promise.all([
      prisma.tarefas.count({
        where: { usuario_id: userId },
      }),
      prisma.tarefas.count({
        where: {
          usuario_id: userId,
          status: { in: ["pendente", "em_andamento"] },
        },
      }),
      prisma.tarefas.count({
        where: {
          usuario_id: userId,
          status: "concluida",
        },
      }),
      prisma.agenda.count({
        where: {
          usuario_id: userId,
          data_evento: {
            gte: new Date(),
          },
        },
      }),
      prisma.transacoes.count({
        where: {
          usuario_id: userId,
          data: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
      }),
    ])

    return {
      totalTarefas,
      tarefasPendentes,
      tarefasConcluidas,
      eventosProximos,
      transacoesRecentes,
    }
  }

  // ===== HEALTH CHECK =====
  static async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { status: "healthy", timestamp: new Date().toISOString() }
    } catch (error) {
      console.error("Database health check failed:", error)
      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
