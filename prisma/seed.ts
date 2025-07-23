import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...")

  // Limpar dados existentes
  await prisma.documentos.deleteMany()
  await prisma.metas_financeiras.deleteMany()
  await prisma.gastos_fixos.deleteMany()
  await prisma.transacoes.deleteMany()
  await prisma.agenda.deleteMany()
  await prisma.tarefas.deleteMany()
  await prisma.projetos.deleteMany()
  await prisma.brandings.deleteMany()
  await prisma.usuarios.deleteMany()

  console.log("🗑️ Dados existentes removidos")

  // Criar usuários
  const camilla = await prisma.usuarios.create({
    data: {
      nome: "Camilla Santos",
      email: "camilla@conexaounk.com",
      senha: "camillaunk",
      tipo: "admin",
      ativo: true,
    },
  })

  const pedro = await prisma.usuarios.create({
    data: {
      nome: "Pedro DJ",
      email: "pedro@conexaounk.com",
      senha: "pedrounk",
      tipo: "dj",
      ativo: true,
    },
  })

  const suzy = await prisma.usuarios.create({
    data: {
      nome: "Suzy Beat",
      email: "suzy@conexaounk.com",
      senha: "suzyunk",
      tipo: "dj",
      ativo: true,
    },
  })

  console.log("👥 Usuários criados")

  // Criar brandings
  await prisma.brandings.create({
    data: {
      usuario_id: pedro.id,
      cor_primaria: "#FF6B35",
      cor_secundaria: "#F7931E",
      descricao_estilo: "House e Techno com energia tropical",
      referencia_social: "@pedrodj_oficial",
    },
  })

  await prisma.brandings.create({
    data: {
      usuario_id: suzy.id,
      cor_primaria: "#E91E63",
      cor_secundaria: "#9C27B0",
      descricao_estilo: "Pop, Funk e Eletrônico com pegada feminina",
      referencia_social: "@suzybeat_oficial",
    },
  })

  console.log("🎨 Brandings criados")

  // Criar projetos
  const projetoFestival = await prisma.projetos.create({
    data: {
      nome: "Festival de Verão 2024",
      descricao: "Participação no maior festival de música eletrônica do Brasil",
      status: "ativo",
      data_inicio: new Date("2024-01-15"),
      data_fim: new Date("2024-03-30"),
      usuario_id: pedro.id,
    },
  })

  const projetoEP = await prisma.projetos.create({
    data: {
      nome: "EP Novo Som",
      descricao: "Produção de EP com 4 faixas autorais",
      status: "ativo",
      data_inicio: new Date("2024-02-01"),
      data_fim: new Date("2024-04-15"),
      usuario_id: pedro.id,
    },
  })

  const projetoTour = await prisma.projetos.create({
    data: {
      nome: "Tour Nordeste",
      descricao: "Turnê por 8 cidades do Nordeste",
      status: "ativo",
      data_inicio: new Date("2024-03-01"),
      data_fim: new Date("2024-05-30"),
      usuario_id: suzy.id,
    },
  })

  console.log("📋 Projetos criados")

  // Criar tarefas
  await prisma.tarefas.create({
    data: {
      titulo: "Finalizar mixagem da faixa 1",
      descricao: "Ajustar graves e agudos da primeira faixa do EP",
      prioridade: "alta",
      status: "em_andamento",
      data_vencimento: new Date("2024-02-20"),
      usuario_id: pedro.id,
      projeto_id: projetoEP.id,
    },
  })

  await prisma.tarefas.create({
    data: {
      titulo: "Contratar técnico de som",
      descricao: "Encontrar técnico especializado para o festival",
      prioridade: "alta",
      status: "pendente",
      data_vencimento: new Date("2024-02-25"),
      usuario_id: pedro.id,
      projeto_id: projetoFestival.id,
    },
  })

  await prisma.tarefas.create({
    data: {
      titulo: "Definir setlist para Salvador",
      descricao: "Criar playlist específica para o público baiano",
      prioridade: "media",
      status: "pendente",
      data_vencimento: new Date("2024-03-10"),
      usuario_id: suzy.id,
      projeto_id: projetoTour.id,
    },
  })

  await prisma.tarefas.create({
    data: {
      titulo: "Reunião com gravadora",
      descricao: "Apresentar proposta de distribuição do EP",
      prioridade: "alta",
      status: "concluida",
      data_vencimento: new Date("2024-02-10"),
      usuario_id: pedro.id,
      projeto_id: projetoEP.id,
    },
  })

  console.log("✅ Tarefas criadas")

  // Criar eventos na agenda
  await prisma.agenda.create({
    data: {
      titulo: "Show no Warung Beach Club",
      descricao: "Apresentação no festival de verão",
      data_evento: new Date("2024-03-15T22:00:00"),
      hora_inicio: "22:00",
      hora_fim: "02:00",
      local: "Warung Beach Club, Itajaí/SC",
      tipo: "show",
      status: "confirmado",
      usuario_id: pedro.id,
    },
  })

  await prisma.agenda.create({
    data: {
      titulo: "Gravação no Estúdio",
      descricao: "Sessão de gravação para o EP",
      data_evento: new Date("2024-02-22T14:00:00"),
      hora_inicio: "14:00",
      hora_fim: "18:00",
      local: "Estúdio Sonora, São Paulo/SP",
      tipo: "gravacao",
      status: "agendado",
      usuario_id: pedro.id,
    },
  })

  await prisma.agenda.create({
    data: {
      titulo: "Show em Salvador",
      descricao: "Abertura da tour nordeste",
      data_evento: new Date("2024-03-20T21:00:00"),
      hora_inicio: "21:00",
      hora_fim: "01:00",
      local: "Casa Rosa, Salvador/BA",
      tipo: "show",
      status: "confirmado",
      usuario_id: suzy.id,
    },
  })

  await prisma.agenda.create({
    data: {
      titulo: "Reunião com Produtora",
      descricao: "Discussão sobre próximos projetos",
      data_evento: new Date("2024-02-28T10:00:00"),
      hora_inicio: "10:00",
      hora_fim: "12:00",
      local: "Escritório UNK Music, São Paulo/SP",
      tipo: "reuniao",
      status: "agendado",
      usuario_id: suzy.id,
    },
  })

  console.log("📅 Agenda criada")

  // Criar transações
  await prisma.transacoes.create({
    data: {
      descricao: "Cachê show Warung",
      valor: 15000.0,
      tipo: "receita",
      categoria: "show",
      data: new Date("2024-01-15"),
      usuario_id: pedro.id,
    },
  })

  await prisma.transacoes.create({
    data: {
      descricao: "Compra de equipamento de som",
      valor: 8500.0,
      tipo: "despesa",
      categoria: "equipamento",
      data: new Date("2024-01-20"),
      usuario_id: pedro.id,
    },
  })

  await prisma.transacoes.create({
    data: {
      descricao: "Cachê show Salvador",
      valor: 12000.0,
      tipo: "receita",
      categoria: "show",
      data: new Date("2024-02-01"),
      usuario_id: suzy.id,
    },
  })

  await prisma.transacoes.create({
    data: {
      descricao: "Passagens aéreas tour",
      valor: 2800.0,
      tipo: "despesa",
      categoria: "viagem",
      data: new Date("2024-02-05"),
      usuario_id: suzy.id,
    },
  })

  console.log("💰 Transações criadas")

  // Criar gastos fixos
  await prisma.gastos_fixos.create({
    data: {
      descricao: "Aluguel do estúdio",
      valor: 2500.0,
      categoria: "infraestrutura",
      dia_vencimento: 5,
      ativo: true,
      usuario_id: pedro.id,
    },
  })

  await prisma.gastos_fixos.create({
    data: {
      descricao: "Streaming services (Spotify, Apple Music)",
      valor: 150.0,
      categoria: "marketing",
      dia_vencimento: 15,
      ativo: true,
      usuario_id: suzy.id,
    },
  })

  await prisma.gastos_fixos.create({
    data: {
      descricao: "Seguro de equipamentos",
      valor: 800.0,
      categoria: "seguro",
      dia_vencimento: 10,
      ativo: true,
      usuario_id: pedro.id,
    },
  })

  console.log("🔄 Gastos fixos criados")

  // Criar metas financeiras
  await prisma.metas_financeiras.create({
    data: {
      nome: "Comprar novo equipamento",
      valor_meta: 25000.0,
      valor_atual: 15000.0,
      data_inicio: new Date("2024-01-01"),
      data_fim: new Date("2024-06-30"),
      status: "ativa",
      usuario_id: pedro.id,
    },
  })

  await prisma.metas_financeiras.create({
    data: {
      nome: "Reserva de emergência",
      valor_meta: 50000.0,
      valor_atual: 28000.0,
      data_inicio: new Date("2024-01-01"),
      data_fim: new Date("2024-12-31"),
      status: "ativa",
      usuario_id: suzy.id,
    },
  })

  console.log("🎯 Metas financeiras criadas")

  // Criar documentos
  await prisma.documentos.create({
    data: {
      nome: "Contrato Warung Beach Club",
      tipo: "contrato",
      conteudo: "Contrato de apresentação musical com todas as cláusulas e condições",
      usuario_id: pedro.id,
      projeto_id: projetoFestival.id,
    },
  })

  await prisma.documentos.create({
    data: {
      nome: "Rider Técnico",
      tipo: "tecnico",
      conteudo: "Especificações técnicas de som, luz e estrutura necessárias",
      usuario_id: pedro.id,
      projeto_id: projetoFestival.id,
    },
  })

  await prisma.documentos.create({
    data: {
      nome: "Roteiro da Tour",
      tipo: "planejamento",
      conteudo: "Cronograma detalhado da tour com datas, locais e contatos",
      usuario_id: suzy.id,
      projeto_id: projetoTour.id,
    },
  })

  console.log("📄 Documentos criados")

  console.log("✅ Seed concluído com sucesso!")
  console.log(`
  📊 Dados criados:
  - 3 usuários (1 admin, 2 DJs)
  - 2 brandings
  - 3 projetos
  - 4 tarefas
  - 4 eventos na agenda
  - 4 transações
  - 3 gastos fixos
  - 2 metas financeiras
  - 3 documentos
  
  🔐 Contas para login:
  - Admin: camilla@conexaounk.com / camillaunk
  - DJ Pedro: pedro@conexaounk.com / pedrounk
  - DJ Suzy: suzy@conexaounk.com / suzyunk
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
