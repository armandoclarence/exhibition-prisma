require('dotenv').config()
import {  PrismaClient } from '@prisma/client'
import express, { response } from 'express'
import {genSaltSync, hashSync, compareSync } from 'bcrypt'
import cors from 'cors'
import {sign} from 'jsonwebtoken'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.APP_PORT || 5000

app.use(express.json())
app.use(cors())

app.get("/users", async(req,res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post("/users", async(req,res) => {
  const data = req.body
  const salt = genSaltSync(10)
  data.password = hashSync(data.password, salt)
  console.log(data)
  try {
    const user = await prisma.user.create({
      data : {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        user_type_id: data.user_type_id
      }
    })
    res.status(201).send({
      data: user,
      message: "created user successfully"
    })
  }catch (error) {
    console.error("Error creating user:", error); // Log error
    res.status(500).send({
      message: "Error creating user"
    });
  }
})

app.post('/users/login', async(req,res) => {
  const data = req.body
  const userByEmail = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })
  if (!userByEmail) {
    res.status(404).send({
      message: "user not found"
    });
    return;
  }
  console.log(userByEmail)
  const decrypted= compareSync(data.password, userByEmail?.password)
  const secretKey = "ayam12"
  if(decrypted) {
    const token = sign({
      sub: userByEmail?.email,
      user_type_id: userByEmail?.user_type_id,
      userId: userByEmail?.userId
    }, secretKey, {
      expiresIn: "1h"
    });
    res.status(200).json({
      message: "login successfully",
      token: token
    })
  }else {
    res.json({
      message: "login failed"
    })
  }
})

app.post('/stall/add', async(req,res) => {
  const data = req.body 
  const hasUserStall = await prisma.stall.findUnique({
    where: {
      userId: data.user.id
    }
  })
  const userAuthorized = await prisma.user.findUnique({
    where: {
      user_status: "AU",
      user_type_id: 2,
      userId: data.user.id
    }
  })
  console.log(userAuthorized)
  console.log(data)
  if(!hasUserStall && userAuthorized){
    const createStall = await prisma.stall.create({
      data: {
        stallName: data?.stallName,
        stallDescription: data?.stallDescription,
        photoUrl: data?.photoUrl,
        videoUrl: data?.videoUrl,
        brochureUrl: data?.brochureUrl,
        userId: data.user.id
      }
    })
    res.status(201).json({
      data: {...createStall},
      responseMessage: "Created stall successfully"
    })
  }
  if(hasUserStall && userAuthorized){
    res.status(400).json({
      responseMessage: "EXHIBITOR ALREADY HAS A STALL"
    })
  }
  res.status(401).json({
    responseMessage: "Can't make a stall ( unauthorized user )"
  })
  // console.log(data)
  // console.log(hasUserStall)
})

app.get('/stall/user/:id', async(req,res) => {
  const data = req.params
  const getStall = await prisma.stall.findUnique({
    where: {
      userId: parseInt(data.id),
    }
  })
  if(!getStall) {
    res.status(404).json({
      message: "stall is not found"
    })
  }
  res.status(200).json({
    id: getStall?.id,
    stallName: getStall?.stallName,
    stallDescription: getStall?.stallDescription,
    photoUrl: getStall?.photoUrl,
    videoUrl: getStall?.videoUrl,
    brochureUrl: getStall?.brochureUrl
  })
  console.log(getStall)
})

// app.get('/stall/:id', async(req,res) => {

// })

app.put('/stall/:id', async(req,res) => {
  const {id} = req.params
  const data = req.body
  console.log(data)
  const getStall = await prisma.stall.findUnique({
    where: {
      id: parseInt(id)
    }
  })
  if(!getStall) {
    res.status(404).json({
      message: "stall not found"
    })
  }
  const updateStall = await prisma.stall.update({
    where: {
      id: parseInt(id),
      userId: getStall?.userId
    },
    data: {
      stallName: data.stallName,
      stallDescription: data.stallDescription,
      photoUrl: data.photoUrl,
      videoUrl: data.videoUrl,
      brochureUrl: data.brochureUrl
    }
  })
  console.log(id)
})

app.get('/exhitors/bending', async(req,res) => {
  try {
    const exhibitors = await prisma.user.findMany({
      where: {
        user_type_id: 2,
        user_status: "UU"
      }
    })
    const responseExhibitor = exhibitors.map(exhibitor => {
      const {userId, user_status, ...rest} = exhibitor
      return {
        id: userId,
        status: user_status,
        ...rest
      }
    })
    console.log(responseExhibitor)
    res.status(200).json({
      results: responseExhibitor
    })
  }catch(error){
    console.log(error)
    res.status(404).json({
      message: "user not found"
    })
  }
})

app.get('/exhitors/approved', async(req,res) => {
  try {
    const exhibitors = await prisma.user.findMany({
      where: {
        user_type_id: 2,
        user_status: "AU"
      }
    })
    const responseExhibitor = exhibitors.map(exhibitor => {
      const {userId, user_status, ...rest} = exhibitor
      return {
        id: userId,
        status: user_status,
        ...rest
      }
    })
    console.log(responseExhibitor)
    res.status(200).json({
      results: responseExhibitor
    })
  }catch(error){
    console.log(error)
    res.status(404).json({
      message: "user not found"
    })
  }
})

app.post('/user/authorize', async(req,res) => {
  const data = req.body
  console.log(data)
  if(data.admin_user_id === 1){
    const userAuthorize = await prisma.user.update({
      where: {
        email: data.emailId,
        userId: data.userId
      },
      data: {
        user_status: "AU"
      }
    })
    console.log(userAuthorize)
    res.status(203).json({
      message: "user authorized success"
    })
  }
  res.status(404).json({
    message: "admin not found"
  })
})

// '/user/authorize'
// router.post('/', createUser)
// router.get('/', checkToken, getUsers)
// router.get('/:id', checkToken, getUserByUserId)
// router.patch('/', checkToken, updateUsers)
// router.delete('/', checkToken, deleteUser)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

