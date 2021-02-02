const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
  // check if has all fields
  const keys = Object.keys(body)
  for (key of keys) {
   if (body[key] == "") {
     return {
       user: body,
       error: 'Preencha todos os campos'
     }
   }
  }
}


async function show (req, res, next) {
 const fillAllFields =  checkAllFields(req.body)
 if(fillAllFields) {
   return res.render('user/register', fillAllFields)
 }
  const{ userId : id } = req.session
    const user = await User.findOne({ where: {id} })
    if (!user) return res.render('user/register', {
      error: 'User not found'
    })

    req.user = user
    next()
}
async function post (req, res, next) {
   //check if user exists
        
   let{email, cpf_cnpj, password, passwordrepeat} = req.body
   cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
   
   const user = await User.findOne({
       where: { email },
       or: { cpf_cnpj },
   })

   if(user) return res.render('user/register', {
     user: req.body,
     error: 'usuario ja cadastrado.'
   })
   //check password match

   if (password != passwordrepeat) return res.render('user/register', {
     user: req.body,
     error: 'O campo da senha eta diferente'
   }) 
       
   
      

  next()
}
async function update(req, res, next) {
  const fillAllFields = checkAllFields(req.body)
  if(fillAllFields) {
    return res.render("user/index", fillAllFields)
  }

  // check if has passwords
  const { id, password} = req.body

  if (!password) return res.render("user/index", {
    user: req.body,
    error: 'Coloque sua senha para atualizar suas informações'
  })

  const user = await User.findOne({ where: {id}})
  const passed = await compare(password, user.password)

  if (!passed) return res.render("user/index", {
    user: req.body,
    error: "Senha incorreta!!"
  })

  req.user = user
  next()
}


module.exports = {
  post,
  show,
  update
}