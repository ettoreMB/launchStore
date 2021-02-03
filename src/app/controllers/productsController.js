const Category = require('../models/Category')
const Product = require('../models/product')
const File = require('../models/File')

const {formatPrice, date} = require ('../../lib/utils.js')



module.exports = {
 async create(req, res) {
    try {
    const  results = await Category.all()
    const categories = results.rows
 
    return res.render('products/create.njk', {categories})
    } catch (error) {
      console(error)
    }
   
  
 },

 async show(req, res) {
  try {
    const product = await Product.find(req.params.id)

    if(!product) return res.send('Produto nao encontrado')

    const {day,month, hours, minutes} = date(product.updated_at)
    product.published = {
      day, 
      hours,
      minutes,
      month
    }

    product.old_price = formatPrice(product.old_price)
    product.price = formatPrice(product.price)

    let files = await Product.files(product.id)
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`

    }))

    return res.render('products/show', {product, files})
  } catch (error) {
    console.log(error)
  }
    
 },

 async edit(req, res) {

    const product = await Product.find(req.params.id);
     
    if (!product) return res.send("Product not found!");
    product.old_price = formatPrice(product.old_price);
    product.price = formatPrice(product.price);

    //get categories
    const categories = await Category.findAll();
    
    
    //get images
    let files = await Product.files(product.id)
    //({ retorna um objeto na function})
    files = files.map(file => ({
      ...file, 
      src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    return res.render("products/edit", { product, categories, files });
 }, 

 async post(req, res) {
    try {
      const keys = Object.keys(req.body)

      for (key of keys) {
        if(req.body[key] == "") {
          return res.send('Preencha todos os campos')
        }
      }
      let {category_id, name, description, old_price, price, quantity, status } = req.body

      price = price.replace(/\D/g,"")

      const product_id = await Product.create({
        category_id,
        user_id: req.session.userId,
        name, 
        description, 
        old_price:old_price|| price, 
        price, 
        quantity, 
        status: status || 1 
      })

      if(req.files.length == 0)
        return res.send('Envie pelo menos 1 imagem')
  

      const filesPromise = req.files.map(file => File.create({ ...file, product_id}))

      await Promise.all(filesPromise)
        

      return res.redirect(`/products/${product_id}`)
    } catch (error) {
      console.error(error);
    }
    

 },

 async put(req, res) {
    try {
      const keys = Object.keys(req.body)

    for (key of keys) {
      if(req.body[key] == "" && key != 'removed_files') {
        return res.send('Preencha todos os campos')
      }
    }

    if(req.files.length != 0 ){
      const newFilesPromise = req.files.map(file => {
        File.create({...file, product_id: req.body.id})
      })
      await Promise.all(newFilesPromise)
    }


    if (req.body.removed_files) {
      // entrada 1,2,3
      const removedFiles = req.body.removed_files.split(',') // [1,2,3,]
      const lasIndex = removedFiles.length -1 
      removedFiles.splice(lasIndex, 1) //saida [1,2,3]

      const removedFilesPromise = removedFiles.map(id => File.delete(id))

      await Promise.all(removedFilesPromise)
    }
  
    req.body.price = req.body.price.replace(/\D/g, "")

    if (req.body.old_price != req.body.price) {
      const oldProduct = await Product.find(req.body.id)

      req.body.old_price = oldProduct.rows[0].price
    } 

    await Product.update(req.body.id, {
      category_id: req.body.category_id,
      name: req.body.name,
      description: req.body.description,
      old_price: req.body.old_price,
      quantity: req.body.quantity,
      status: req.body.status,

    });

    return res.redirect(`/products/${req.body.id}`)
    } catch (error) {
      console(error)
    }
    
 },

 async delete(req, res) {
    await Product.delete(req.body.id)
    return res.redirect('/products/create')
 }

}