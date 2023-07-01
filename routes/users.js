var express = require('express');
var router = express.Router();
var db = require('mongodb').MongoClient;
const productHelper = require('../helpers/product-helper')
const userHelper= require('../helpers/user-helper');
const session = require('express-session');
const { resolve } = require('promise');
const { response } = require('../app');
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',async function(req, res, next) {
  let user=req.session.user
  console.log(user)
  let cartCount=null
  if(user){
  cartCount=await userHelper.getCartCount(req.session.user._id)
  }
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { products ,user,cartCount})
  })
 
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/login',{"loginErr":req.session.LoginEr})
    req.session.LoginEr=false
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userHelper.doSignUp(req.body).then((response)=>{
      //console.log(response)
      req.session.loggedIn=true
      req.session.user=response
      res.redirect('/')
    })
})
router.post('/login',(req,res)=>{
    userHelper.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/')
      }else{
        req.session.LoginEr="Invalid username or password!!"
        res.redirect('/login')
      }
    })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products= await userHelper.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user})

})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log('api call');
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{
  userHelper.changeProductQuantity(req.body).then((response)=>{
    res.json(response)
  })
})
router.post('/remove-cart-item',(req,res,next)=>{
  userHelper.removeCartItem(req.body).then((response)=>{
    res.json(response)
  })
})
router.get('/place-order',verifyLogin,async(req,res)=>{
  let products= await userHelper.getCartProducts(req.session.user._id)
  res.render('user/checkout',{products,user:req.session.user})
})
router.get('/remove-from-cart/:id',verifyLogin,(req,res)=>{
    let proId=req.params.id
    userHelper.removeFromCart(proId).then((response)=>{
      res.redirect('/cart',)
    })
})
module.exports = router;
