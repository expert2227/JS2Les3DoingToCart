/**
 * 1.добавить корзину на стр, и добавить уже готовое её содержимое на дивах
 *    1.1 toggle add class hidden
 * 2. в каталоге товаров +but add to cart, можно сделать во время рендера товаров на стр
 */

class ProductList {
  constructor(container = '.products', api = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses') {
    this.container = document.querySelector(container);
    this.goods = [];
    this.productObjects = [];
    this.api = api;
    this.getProducts(api)
      .then((data) => {
        this.goods = data;
        this.render();
        new Basket(this.productObjects, this.api);
      });
  }

  getProducts(url) {
    return fetch(`${url}/catalogData.json`)
      .then(response => response.json())
      .catch(err => console.log(err));
  }

  render() {
    for (const good of this.goods) {
      const productObject = new ProductItem(good);
      console.log(productObject);
      this.productObjects.push(productObject);

      this.container.insertAdjacentHTML('beforeend', productObject.getHTMLString());
    }
  }
}

class ProductItem {
  constructor(product, img = 'https://via.placeholder.com/200x150') {
    this.id_product = product.id_product;
    this.product_name = product.product_name;
    this.price = product.price;
    this.img = img;
  }

  getHTMLString() {
    return `<div class="product-item" data-id="${this.id_product}">
                  <img src="${this.img}" alt="Some img">
                  <div class="desc">
                      <h3>${this.product_name}</h3>
                      <p>${this.price} \u20bd</p>
                      <button class="buy-btn">Купить</button>
                  </div>
              </div>`;
  }
}

class Basket {
  constructor(productObjects, api, btnOnCart = '.btn-cart', addToBasket = 'addToBasket.json', deleteFromBasket = 'deleteFromBasket.json') {
    this.productObjects = productObjects;
    this.api = api;
    this.btnOnCart = document.querySelector(btnOnCart);
    this.addToBasket = addToBasket;
    this.deleteFromBasket = deleteFromBasket;
    const divProduct = document.querySelectorAll('.buy-btn');
    this.addClickEventProduct(divProduct);
    this.basketOnPage(this.btnOnCart);

  }

  getData(api, apiFinish) {
    return fetch(`${api}/${apiFinish}`)
      .then(response => response.json())
      .catch(err => console.log(err));
  }

addClickEventProduct(divProduct) {
  divProduct.forEach((elInCart) => {
    elInCart.addEventListener('click', this.elemInMasRenderEl)
  })
}
basketOnPage(basket) {
  basket.addEventListener('click', (onOff) => {
    let onPage = document.querySelector('.mainCart');
    onPage.classList.toggle('hidden');
  })
}
addProdToBasket(api, addToBasket) {
  getData(this.api, this.addToBasket)
    .then((answer) => {
      if (answer == 1) {
        console.log('product is added in cart!');
      }
    })
}
elemInMasRenderEl(event, api, addToBasket) {
  this.addProdToBasket(api, addToBasket);
  let currentId = event.path[2].dataset.id;
  /**
   * 1. addToBasket  запуск фетча к файлу addToBasket если вернулся 1,
   * берет id по которому клик и проверяет есть ли он уже на стр
   * если есть то run func ++ на стр, затем run func ++ в общую сумму
   * если его нет, то берет его id, name, price и рисует на стр
   * 
   * 2. getBasket  запуск фетча к файлу json и отрисовка данных
   *  в самой корзине с помошью этого файла
   *  
   * 3. deleteFromBasket  запуск фетч к файлу json/ if ответ 1,
   * удаляем из массива товар и отрисовываем заново
   */
  const prod = event.path[2].children[1];
  new ElementAddInCart(prod);
}

  
}

/**
 * класс товара который проверяет есть ли элемент по которому произошел клик в массиве
 * если есть то мы запускаем метод увеличения кол-ва данного товара в массиве, 
 * а затем снова передаем массив корзине для дальнейшей отрисовки в самой корзине
 */
class ElementAddInCart {
  constructor(prod) {
    const elementInToCart = [];
    if (!(prod in elementInToCart)) {
      elementInToCart.push(prod);
    } else {
      console.log(elementInToCart);
    }
  }
}

new ProductList();
