import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'ido@gmail.com'
  
  console.log(`Création du compte admin pour ${email}...`)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: 'azerty', // En production, il faudrait hasher ce mot de passe
      fullName: 'ido efraim',
      phone: '+22601479800',
      role: Role.ADMIN,
    },
    create: {
      email,
      password: 'azerty',
      fullName: 'ido efraim',
      phone: '+22601479800',
      role: Role.ADMIN,
    },
  })

  console.log('Compte Admin créé avec succès :', admin)
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
