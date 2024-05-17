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
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-container");

    const imagesDiv = document.createElement("div");
    imagesDiv.classList.add("images-container");

    const productName = document.createElement("span");
    productName.textContent = product.productName;

    let firstImg;

    const imgs = product.details.items[0].images.map((image, index) => {
      const img = document.createElement("img");
      img.src = image.imageUrl;
      img.alt = image.imageText;
      console.log(index);
      if (index === 0) {
        firstImg = img.cloneNode();
        firstImg.classList.add("main-img");
      }
      img.classList.add("product-img");
      img.addEventListener("click", handleChangeImgSrc);
      return img;
    });

    const pricesDiv = document.createElement("div");
    pricesDiv.classList.add("prices-container");

    const price = document.createElement("p");
    price.classList.add("price");
    const priceValue =
      product.details.items[0].sellers[0].commertialOffer.PriceWithoutDiscount;
    price.textContent = `R$ ${priceValue}`;

    const promotionPrice = document.createElement("p");
    const promoPriceValue =
      product.details.items[0].sellers[0].commertialOffer.Price;
    promotionPrice.textContent = `R$ ${promoPriceValue}`;

    const button = document.createElement("button");
    button.textContent = "Comprar";

    const productsContainer = document.querySelector("#products-container");

    imgs.forEach((img) => imagesDiv.appendChild(img));
    productDiv.appendChild(firstImg);
    productDiv.appendChild(productName);
    productDiv.appendChild(imagesDiv);
    productDiv.appendChild(pricesDiv);
    pricesDiv.appendChild(price);
    if (priceValue != promoPriceValue) {
      pricesDiv.appendChild(promotionPrice);
      price.classList.add("old-price");
      price.classList.remove("price");
      promotionPrice.classList.add("price");
    }
    productDiv.appendChild(button);
    productsContainer.appendChild(productDiv);
  });
}

function productsShownController() {
  const productsToggler = document.createElement("p");
  productsToggler.id = "toggle-products";
  const productsContainer = document.querySelector("main");
  productsContainer.insertBefore(productsToggler, productsContainer.firstChild);

  setProductsShown();

  productsToggler.addEventListener("click", handleChangeDisplayedProductsClick);

  window.addEventListener("resize", handleResize);
}

function setProductsShown() {
  const productsShown = getGridBasedOnBreakpoints();
  handleChangeDisplayedProductsHTML(productsShown);
}

function handleChangeDisplayedProductsClick() {
  const productsToggler = document.querySelector("#toggle-products");
  const productsShown = parseInt(productsToggler.textContent.split(" ")[1]);

  const newProductsShown =
    getNewProductsShownBasedOnScreenSizeThreshold(productsShown);
  handleChangeDisplayedProductsHTML(newProductsShown);
}

function handleChangeDisplayedProductsHTML(productsShown) {
  const productsToggler = document.querySelector("#toggle-products");
  const productsContainer = document.querySelector("#products-container");
  productsToggler.textContent = `Mostrando ${productsShown} produto${
    productsShown > 1 ? "s" : ""
  }`;
  productsContainer.style.gridTemplateColumns = `repeat(${productsShown}, 1fr)`;
}

function handleResize() {
  setProductsShown();
}

function getGridBasedOnBreakpoints() {
  const breakpoint = getScreenBreakpoint();
  let grid;
  switch (breakpoint) {
    case "xs":
      grid = 1;
      break;
    case "sm":
      grid = 2;
      break;
    case "md":
      grid = 3;
      break;
    case "lg":
      grid = 4;
      break;
    default:
      grid = 5;
      break;
  }
  return grid;
}

function getScreenBreakpoint() {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  let breakpoint;
  if (width <= 576) {
    breakpoint = "xs";
  } else if (width <= 900) {
    breakpoint = "sm";
  } else if (width <= 1200) {
    breakpoint = "md";
  } else if (width <= 1500) {
    breakpoint = "lg";
  } else {
    breakpoint = "xl";
  }
  return breakpoint;
}

function getNewProductsShownBasedOnScreenSizeThreshold(productsShown) {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const productContainerWidth = 300;

  const maxProducts = Math.floor(screenWidth / productContainerWidth);

  let newProductsShown = productsShown == maxProducts ? 1 : productsShown + 1;

  if (newProductsShown > maxProducts) {
    newProductsShown = maxProducts;
  }

  return newProductsShown;
}

function handleChangeImgSrc(event) {
  const img = event.target;
  const imgMainDiv = img.closest(".product-container");
  const mainImg = imgMainDiv.querySelector(".main-img");
  mainImg.src = img.src;
}
