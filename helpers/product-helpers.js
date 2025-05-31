const { ObjectId } = require("mongodb");
const { PRODUCT_COLLECTIONS } = require("../config/collections");
const db = require("../config/connection");

const addProduct = async (product, callback) => {
  db.get()
    .collection(PRODUCT_COLLECTIONS)
    .insertOne(product)
    .then((data) => {
      console.log(data.insertedId, data.insertedId + "");
      callback(data.insertedId + "");
    });
};
const getAllProduct = () => {
  return new Promise(async (resolve, reject) => {
    let product = await db
      .get()
      .collection(PRODUCT_COLLECTIONS)
      .find()
      .toArray();
    resolve(product);
  });
};

const deleteProduct = (proId) => {
  return new Promise(async (res, rej) => {
    const response = await db
      .get()
      .collection(PRODUCT_COLLECTIONS)
      .deleteOne({ _id: new ObjectId(proId) });
    res(response);
  });
};
const getProductDetails = async (proId) => {
  const data = await db
    .get()
    .collection(PRODUCT_COLLECTIONS)
    .findOne({ _id: new ObjectId(proId) });
  return data;
};
const updateProduct = async (proId,productDetails) => {
  const details = await db
    .get()
    .collection(PRODUCT_COLLECTIONS)
    .updateOne(
      { user: new ObjectId(proId) },
      {
        $set: {
          name: productDetails.name,
          category: productDetails.category,
          price: productDetails.price,
          description: productDetails.description,
        },
      }
    );
  return details;
};

module.exports = {
  addProduct,
  getAllProduct,
  deleteProduct,
  getProductDetails,
  updateProduct,
};
