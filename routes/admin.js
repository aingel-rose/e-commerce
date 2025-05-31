var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  productHelpers.getAllProduct().then((product) => {
    console.log(product);
    res.render("partial/view-product", { admin: true, product });
  });
});
router.get("/add-product", (req, res) => {
  res.render("partial/add-product");
});
router.post("/add-product", async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  await productHelpers.addProduct(req.body, (id) => {
    let img = req.files.image;
    img.mv("./public/products-images/" + id + ".png", (err) => {
      if (!err) {
        res.redirect("/admin")
      } else {
        console.log(err);
      }
    });
  });
});


router.get("/delete-product/:id",(req,res)=>{
  let proId = req.params.id
  console.log(proId)
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect("/admin")
  })
  
})
router.get("/edit-product/:id",async(req,res)=>{
 
  let data=await productHelpers.getProductDetails(req.params.id)
  console.log(data)
  res.render("partial/edit-product",{data})

})

router.post("/edit-product/:id",(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then((response)=>{
    res.redirect("/admin")
    if(req.files.image){
      let img = req.files.image
    img.mv("./public/products-images/" + req.params.id + ".png")
      
    }
  })
})

module.exports = router;
