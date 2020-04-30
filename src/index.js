const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];

function getShoppingCart(ids, productsList) {
  let cartCategorys = [];

  const filteredProducts = productsList.filter((item) => ids.includes(item.id));

  const cartProducts = filteredProducts.map((item) => {
    if (!cartCategorys.includes(item.category))
      cartCategorys.push(item.category);

    return {
      name: item.name,
      category: item.category,
    };
  });

  const promotion =
    cartCategorys.length <= 4
      ? promotions[cartCategorys.length - 1]
      : promotions[3];

  const getCartInfos = (filteredProducts) => {
    let totalPrice = 0;
    let discountValue = 0;
    let productsWithPromo = [];
    filteredProducts.map((item) => {
      item.promotions.map((it) => {
        if (it.looks.includes(promotion)) {
          totalPrice = totalPrice + it.price;
          discountValue = discountValue + (item.regularPrice - it.price);
          productsWithPromo.push(item.id);
        }
      });
    });
    const calculatePriceWithoutPromo = (filteredProducts) => {
      const productsWithoutPromo = filteredProducts.filter(
        (item) => !productsWithPromo.includes(item.id)
      );

      const totalPriceWithoutPromo = productsWithoutPromo.reduce(
        (total, item) => total + item.regularPrice,
        0
      );
      return totalPriceWithoutPromo;
    };
    const regularPrice = calculatePriceWithoutPromo(filteredProducts);

    if (regularPrice > 0) {
      totalPrice = totalPrice + regularPrice;
    }

    return { totalPrice, discountValue };
  };

  const { totalPrice, discountValue } = getCartInfos(filteredProducts);

  const totalRegularPrice = filteredProducts.reduce(
    (totalRegularPrice, item) => totalRegularPrice + item.regularPrice,
    0
  );

  const discountPercentage = `${(
    (discountValue / totalRegularPrice) *
    100
  ).toFixed(2)}%`;

  return {
    products: cartProducts,
    promotion: promotion,
    totalPrice: totalPrice.toFixed(2),
    discountValue: discountValue.toFixed(2),
    discount: discountPercentage,
  };
}

module.exports = { getShoppingCart };
