import { PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
  const users = await prisma.user.findMany({where: {user_type_id: 1}})
  console.log(users)
  users.map(async(user) => {
    let {userId, password} = user
    const salt = genSaltSync(10)
    password = 'asu123'
    password = hashSync(password, salt)
    const userUpdate = await prisma.user.update({
      where: {
        userId: userId
      },
      data: {
        password: password
      }
    })
    
    console.log(user)
  })
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