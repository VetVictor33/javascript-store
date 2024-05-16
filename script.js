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
    mainDiv.appendChild(firstImg);
    mainDiv.appendChild(productName);
    mainDiv.appendChild(imagesDiv);
    mainDiv.appendChild(price);
    if (priceValue != promoPriceValue) {
      mainDiv.appendChild(promotionPrice);
      price.classList.add("old-price");
      price.classList.remove("price");
      promotionPrice.classList.add("price");
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
  const breakpoint = getScreenBreakpoint();
  const productsShown = breakpoint ? 2 : 5;
  handleChangeDisplayedProductsHTML(productsShown);
}

function handleChangeDisplayedProductsClick() {
  const productsToggler = document.querySelector("#toggle-products");

  const productsShown = parseInt(productsToggler.textContent.split(" ")[1]);

  const newProductsShown = productsShown == 5 ? 1 : productsShown + 1;

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
  const productsShown = getGridBasedOnBreakpoint();
  setInitialProductsShown(productsShown);
}

function getScreenBreakpoint() {
  const width = window.innerWidth;

  let breakpoint;
  if (width <= 576) {
    breakpoint = "xs";
  } else if (width <= 768) {
    breakpoint = "sm";
  } else if (width <= 992) {
    breakpoint = "md";
  } else {
    breakpoint = "lg";
  }
  return breakpoint;
}

function getGridBasedOnBreakpoint() {
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

function handleChangeImgSrc(event) {
  const img = event.target;
  const imgMainDiv = img.closest(".product-container");
  const mainImg = imgMainDiv.querySelector(".main-img");
  mainImg.src = img.src;
}
