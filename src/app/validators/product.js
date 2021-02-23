async function post(req, res, next) {
  const keys = Object.keys(req.body)
    for (key of keys) {
      if(req.body[key] == "") {
        return res.send('Preencha todos os campos')
      }
    }

    if(!req.files || req.files.length == 0)
      return res.send('Envie pelo menos 1 imagem')

      next()
}

async function put(req, res, next ) {
  const keys = Object.keys(req.body)

    for (key of keys) {
      if(req.body[key] == "" && key != 'removed_files') {
        return res.send('Preencha todos os campos')
      }
    }

    next()
}
 

module.exports ={
  post,
  put
}