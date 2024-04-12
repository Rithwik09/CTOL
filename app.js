const express = require('express')
const { sequelize, User, Post} = require('./models');


const app = express()

app.use(express.json())

 app.post('/users', async(req, res) => {
    const { name, email , phone} = req.body
    try {
       const user = await User.create({ name, email, phone})
       return res.json(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    } 
 })
app.get('/users', async(req, res) => {
   try {
      const users = await User.findAll()
      return res.json(users)
   } catch(err) {
      console.log(err)
      return res.status(500).json({error: 'something went wrong'})
   }
})

app.get('/users/:uuid', async(req, res) => {
   const uuid = req.params.uuid
   try {
      const user = await User.findOne({
         where: {uuid },
         include: 'posts', //getting post data also from alias posts
      })
      return res.json(user)
   } catch(err) {
      console.log(err)
      return res.status(500).json({error: 'something went wrong'})
   }
})

app.post('/posts', async (req, res) => {
   const { userUuid, body } =  req.body
   try {
      const user = await User.findOne({ where: { uuid: userUuid}})
      const post = await Post.create({ body, userId: user.id })

      return res.json(post)
   } catch (err) {
      console.log(err)
      return res.status(500).json(err)
   }
})

app.get('/posts', async (req, res) => {
   try {
    const posts = await Post.findAll({ include: 'user'})// can add multiple relatiions pass as a array
      return res.json(posts)
   } catch (err) {
      console.log(err)
      return res.status(500).json(err)
   }
})


app.delete('/users/:uuid', async(req, res) => {
   const uuid = req.params.uuid
   try {
      const user = await User.findOne({where: {uuid } })
      await user.destory()

      return res.json({ message: 'user deleted'})
   }git  catch(err) {
      console.log(err)
      return res.status(500).json({error: 'something went wrong'})
   }
})

app.put('/users/:uuid', async(req, res) => {
   const uuid = req.params.uuid
   const { name, email, phone } = req.body
   try {
      const user = await User.findOne({where: {uuid }})
      user.name = name
      user.email = email
      user.phone = phone
      
      await user.save()
      
      return res.json(user)
   } catch(err) {
      console.log(err)
      return res.status(500).json({error: 'something went wrong'})
   }
})
 app.listen({port: 5000}, async () => {
    console.log('Server is running on port 5000')
    await sequelize.authenticate()
    console.log('Database Connected!')
 })