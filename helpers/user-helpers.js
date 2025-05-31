const bcrypt = require("bcryptjs");
const db = require("../config/connection");
const { USER_COLLECTIONS, CART_COLLECTIONS, PRODUCT_COLLECTIONS } = require("../config/collections");
const { ObjectId } = require("mongodb");
const { response } = require("express");
const { pipeline } = require("stream");

const doSignup = (userData) => {
  return new Promise(async (resolve, reject) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    db.get()
      .collection(USER_COLLECTIONS)
      .insertOne(userData)
      .then((data) => {
        resolve(data);
      });
  });
};

const doLogin = (userData) => {
  return new Promise(async (resolve, reject) => {
    let user = await db
      .get()
      .collection(USER_COLLECTIONS)
      .findOne({ email: userData.email });
    if (user) {
      bcrypt.compare(userData.password, user.password).then((match) => {
        if (match) {
          console.log("login success");
          resolve({ user, status: true });
        } else {
          console.log("password wrong");
          resolve({ status: false });
        }
      });
    } else {
      console.log("login fail");
      resolve({ status: false });
    }
  });
};
const addToCart = (proId, userId) => {
    let proObj={
      item:ObjectId(proId),
      quantity:1,
    }

 
  return new Promise(async (resolve, reject) => {
    let userCart = await db
      .get()
      .collection(CART_COLLECTIONS)
      .findOne({ user: new ObjectId(userId) });
    console.log(userCart);
    if (userCart) {
      db.get()
        .collection(CART_COLLECTIONS)
        .updateOne(
          { user: new ObjectId(userId) },
          {
            $push: { products: new ObjectId(proObj) },
          }
        )
        .then((response) => {
          resolve();
        });
    } else {
      let cartObj = {
        user: new ObjectId(userId),
        products: [proObj],
      };
      db.get()
        .collection(CART_COLLECTIONS)
        .insertOne(cartObj)
        .then((response) => {
          resolve();
        });
    }
  });
};
const getCartProduct = async (userId) => {
  let cartItem = await db
    .get()
    .collection(CART_COLLECTIONS)
    .aggregate([
      {
        $match: { user: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: PRODUCT_COLLECTIONS,
          let: { proList: "$products" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$proList"],
                },
              },
            },
          ],
          as:"cartAttach"
        },
      },
    ]).toArray()
    return cartItem[0].cartAttach

};
const getCartCount=async(userId)=>{
  count=0
  let cart = await db.get().collection(CART_COLLECTIONS).findOne({user:new ObjectId(userId)})
  if(cart){
    count=cart.products.length
  }
  return count
}

module.exports = {
  doSignup,
  doLogin,
  addToCart,
  getCartProduct,
  getCartCount,
};
