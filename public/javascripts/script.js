function addToCart(proId) {
  fetch("/add-to-cart/" + proId, { method: "get" }).then((response) => {
    if (response.status) {
      let count = document.getElementById("cart-count");
      count.innerHTML = Number(count.innerHTML) + 1;
    }
  });
}
