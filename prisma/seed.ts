import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.brandings.deleteMany({})
  await prisma.usuarios.deleteMany({})

  // Admin
  await prisma.usuarios.create({
    data: {
      nome: "Camilla Mello",
      email: "camilla@conexaounk.com",
      senha: "camillaunk",
      tipo: "admin",
    },
  })

  // DJ Pedro
  const pedro = await prisma.usuarios.create({
    data: {
      nome: "Dj Pedro Theodoro",
      email: "pedro@conexaounk.com",
      senha: "pedrounk",
      tipo: "dj",
    },
  })

  await prisma.brandings.create({
    data: {
      usuario_id: pedro.id,
      cor_primaria: "azul escuro",
      cor_secundaria: "preto",
      logo_url: "https://ibb.co/60QRXQGc",
      descricao_estilo: "tribal house",
      referencia_social: "https://soundcloud.com/dj_pedro_theodoro, https://www.instagram.com/djpedrotheodoro/",
    },
  })

  // DJ Suzy
  const suzy = await prisma.usuarios.create({
    data: {
      nome: "Dj Suzy Prado",
      email: "suzy@conexaounk.com",
      senha: "suzyunk",
      tipo: "dj",
    },
  })

  await prisma.brandings.create({
    data: {
      usuario_id: suzy.id,
      cor_primaria: "amarelo",
      cor_secundaria: "preto",
      logo_url: "https://ibb.co/dw11t5cF",
      descricao_estilo: "tribal house",
      referencia_social: "https://soundcloud.com/djsuzypradooficial, https://www.instagram.com/djsuzyprado/",
    },
  })

  // DJ Gustavo
  const gustavo = await prisma.usuarios.create({
    data: {
      nome: "Dj Gustavo Mello",
      email: "gustavo@conexaounk.com",
      senha: "gustavounk",
      tipo: "dj",
    },
  })

  await prisma.brandings.create({
    data: {
      usuario_id: gustavo.id,
      cor_primaria: "verde",
      cor_secundaria: "preto",
      logo_url: "https://ibb.co/sample",
      descricao_estilo: "tech house",
      referencia_social: "https://soundcloud.com/djgustavomello, https://www.instagram.com/djgustavomello/",
    },
  })

  console.log("Seed concluído com sucesso!")
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
