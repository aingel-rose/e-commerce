var express = require("express");
var router = express.Router();
const productHelpers = require("../helpers/product-helpers");
const {
  doSignup,
  doLogin,
  addToCart,
  getCartProduct,
  getCartCount,
} = require("../helpers/user-helpers");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
  let user = req.session.user;
  console.log(user);

  let cartCount = null;
  if (req.session.user) {
    cartCount = await getCartCount(req.session.user._id);
  }

  productHelpers.getAllProduct().then((product) => {
    res.render("user/user-product", { product, admin: false, user, cartCount });
  });
});
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("user/login", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});
router.get("/signup", (req, res) => {
  res.render("user/signup");
});
router.post("/signin", (req, res) => {
  doSignup(req.body).then((user) => {
    console.log(user);
    req.session.loggedIn = true;
    req.session.user = user;
  });
  res.redirect("/");
});
router.post("/login", (req, res) => {
  doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      req.session.loginErr = true;
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/cart", verifyLogin, async (req, res) => {
  const products = await getCartProduct(req.session.user._id);
  console.log(products);
  res.render("user/cart", { products, user: req.session.user });
});
router.get("/add-to-cart/:id", async (req, res) => {
  console.log("api call");
  const data = await addToCart(req.params.id, req.session.user._id);
  res.status(200).json({ status: true, data });
});

module.exports = router;
