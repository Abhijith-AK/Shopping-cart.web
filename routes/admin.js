var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
/* GET users listing. */
router.get('/', function (req, res, next) {
  
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products', { admin: true, products })
  })
  
});
router.get('/add-products', (req, res) => {
  res.render('admin/add-products')
})
router.post('/add-products', (req, res) => {
  productHelper.addproduct(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-products',{admin:true})
      } else {
        console.log(err)
      }
    })

  })
})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })

})
router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelper.getProductDetails(req.params.id)
  //console.log(product);
  res.render('admin/edit-product',{product})
})
router.post('/edit-products/:id',(req,res)=>{
  let id=req.params.id
  //console.log(req.params.id,req.body);
  productHelper.upateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/' + id + '.jpg')
    } 
  })
})


module.exports = router;
