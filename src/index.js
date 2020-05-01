const promotions = ["SINGLE LOOK", "DOUBLE LOOK", "TRIPLE LOOK", "FULL LOOK"];

function getShoppingCart(ids, productsList) {
  const filteredProducts = productsList.filter((item) => ids.includes(item.id));

  const {cartProducts, cartCategorys} = filteredProducts.reduce((acc, produto) => {
    acc.cartCategorys.add(produto.category);
    acc.cartProducts.push({
      name: produto.name,
      category: produto.category,
    });
    return acc;
  }, {
    cartProducts: [],
    cartCategorys: new Set() //Não permite a adição de itens duplicados
  });

  const promotion =
    cartCategorys.size <= 4
      ? promotions[cartCategorys.size - 1]
      : promotions[3];

  const {
    totalPrice,
    discountValue,
    totalRegularPrice
  } = getCartInfo(filteredProducts, promotion);

  const discountPercentage = (discountValue / totalRegularPrice) * 100;

  return {
    products: cartProducts,
    promotion: promotion,
    totalPrice: formatValue(totalPrice),
    discountValue: formatValue(discountValue),
    discount: formatPercentage(discountPercentage)
  };
}

function getCartInfo(filteredProducts, promotion) {
  return filteredProducts.reduce((acc, produto) => {
    for (let promocao of produto.promotions) {
      if (promocao.looks.includes(promotion)) {
        acc.totalPrice += promocao.price;
        acc.discountValue += produto.regularPrice - promocao.price;
        acc.totalRegularPrice += produto.regularPrice;
        return acc;
      }
    }
    acc.totalPrice += produto.regularPrice;
    acc.totalRegularPrice += produto.regularPrice;
    return acc;
  }, {
    totalPrice: 0,
    discountValue: 0,
    totalRegularPrice: 0
  });
}

function formatPercentage(percentage) {
  return `${formatValue(percentage)}%`
}

function formatValue(value) {
  return value ? value.toFixed(2) : 0.00;
}

module.exports = {getShoppingCart};
