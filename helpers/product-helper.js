const { resolve, reject } = require('promise')
var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {
    addproduct: (product, callback) => {
        db.get().collection('product').insertOne(product).then((data) => {
            callback(data.ops[0]._id)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLETION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLETION).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLETION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    upateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLETION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    
}