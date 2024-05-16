async function main() {
  await displayProducts();
  productsShownController();
}

main();

async function displayProducts() {
  const response = await fetch("https://desafio.xlow.com.br/search");
  const products = await response.json();

  const detailedProducts = await Promise.all(
    products.map(async (item) => {
      const response = await fetch(
        `https://desafio.xlow.com.br/search/${item?.productId}`
      );
      const [details] = await response.json();
      return { ...item, details };
    })
  );

  detailedProducts.forEach((product) => {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("product-container");

    const imagesDiv = document.createElement("div");
    imagesDiv.classList.add("images-container");

    const productName = document.createElement("h3");
    productName.textContent = product.productName;

    const imgs = product.details.items[0].images.map((image) => {
      const img = document.createElement("img");
      img.classList.add("product-img");
      img.src = image.imageUrl;
      img.alt = image.imageText;
      img.addEventListener("click", handleChangeImgSrc);
      return img;
    });

    const [firstImg] = imgs;
    const clonedFirstImg = firstImg.cloneNode();
    clonedFirstImg.classList.add("main-img");

    const price = document.createElement("p");
    const fullPriceValue =
      product.details.items[0].sellers[0].commertialOffer.PriceWithoutDiscount;
    price.textContent = `R$ ${fullPriceValue}`;

    const promotionPrice = document.createElement("p");
    const promoPriceValue =
      product.details.items[0].sellers[0].commertialOffer.Price;
    promotionPrice.textContent = `R$ ${promoPriceValue}`;

    const button = document.createElement("button");
    button.textContent = "Comprar";

    const productsContainer = document.querySelector("#products-container");

    imgs.forEach((img) => imagesDiv.appendChild(img));
    mainDiv.appendChild(productName);
    mainDiv.appendChild(clonedFirstImg);
    mainDiv.appendChild(imagesDiv);
    mainDiv.appendChild(price);
    if (fullPriceValue !== promoPriceValue) {
      mainDiv.appendChild(promotionPrice);
      price.style.textDecoration = "line-through";
    }
    mainDiv.appendChild(button);
    productsContainer.appendChild(mainDiv);
  });
}

function productsShownController() {
  const productsToggler = document.createElement("p");
  productsToggler.id = "toggle-products";
  const productsContainer = document.querySelector("main");
  productsContainer.insertBefore(productsToggler, productsContainer.firstChild);

  setInitialProductsShown();

  productsToggler.addEventListener("click", handleChangeDisplayedProductsClick);

  window.addEventListener("resize", handleResize);
}

function setInitialProductsShown() {
  const mobile = isMobile();
  const productsShown = mobile ? 2 : 5;
  handleChangeDisplayedProductsHTML(productsShown);
}

function handleChangeDisplayedProductsClick() {
  const mobile = isMobile();
  const productsToggler = document.querySelector("#toggle-products");

  const productsShown = parseInt(productsToggler.textContent.split(" ")[1]);

  const newProductsShown = mobile
    ? productsShown === 2
      ? 1
      : 2
    : productsShown === 5
    ? 4
    : 5;

  handleChangeDisplayedProductsHTML(newProductsShown);
}

function handleChangeDisplayedProductsHTML(productsShown) {
  const productsToggler = document.querySelector("#toggle-products");
  const productsContainer = document.querySelector("#products-container");
  productsToggler.textContent = `Mostrando ${productsShown} produtos`;
  productsContainer.style.gridTemplateColumns = `repeat(${productsShown}, 1fr)`;
}

function handleResize() {
  const mobile = isMobile();
  const productsShown = mobile ? 2 : 5;
  setInitialProductsShown(productsShown);
}

function isMobile() {
  return window.innerWidth <= 768;
}

function handleChangeImgSrc(event) {
  const img = event.target;
  const imgMainDiv = img.closest(".product-container");
  const mainImg = imgMainDiv.querySelector(".main-img");
  mainImg.src = img.src;
}
