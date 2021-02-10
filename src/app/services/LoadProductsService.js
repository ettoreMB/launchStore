const Product = require('../controllers/productsController')
const {formatPrice, date} = require ('../../lib/utils.js')


async function getImages(productId) {
  let files = await Product.files(productId) 
  files = files.map(file => ({
    ...file, 
    src: `${file.path.replace('public', '')}`
  }))
    
    
  return files[0]
}

async function format(product) {
  const files = await getImages(product.id)
  product.img = files[0].src
  product.files = files
  product.formatedPrice = formatPrice(product.price)
  product.formatedOldPrice = formatPrice(product.old_price)

  const {day,month, hours, minutes} = date(product.updated_at)
    product.published = {
      day: `${day}/${month}`,
      hours: `${hours}h${minutes}`
    }

  return product
}

const loadService = {
  load(service, filter) {
    this.filter = filter
    return this[service]()
  },
  product(){
    try {
      const product = await Product.findOne(this.filter)
      return format(product)
    } catch (error) {
      console.error(error)
    }
  },
  products(){
    try {
      const products = await Product.findAll(this.filter)
      const produtcsPromise = products.map(format)  //products.map(product=> format(product))
      return Promise.all(produtcsPromise)
    } catch (error) {
      console.error(error)
    }
  },
  format,
}


module.exports = {
  loadService
}