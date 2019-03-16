const deleteProduct = btn => {
  const prodId = btn.parentNode.querySelector("input[name=productId]").value;
  const _csrf = btn.parentNode.querySelector("input[name=_csrf]").value;

  const productElement = btn.closest("article");

  console.log(prodId, _csrf);

  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": _csrf
    }
  })
    .then(result => result.json())
    .then(data => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => console.log(err));
};
