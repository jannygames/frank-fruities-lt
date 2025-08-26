// redirect with arguments
function modifyUrlParams(arg = null, val = null) {
  Shopify.queryParams = {};
  if (location.search.length) {
    var params = location.search.substr(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var keyValue = params[i].split('=');
      if (keyValue.length) {
        Shopify.queryParams[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
      }
    }
  }
  if (arg) Shopify.queryParams[arg] = val;
  location.search = new URLSearchParams(Shopify.queryParams).toString();
}

// go to collection
function collectionGoto(handle) {
  location.pathname = '/collections/' + handle;
}

// mobile menu
document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
  document.getElementById('mobile-menu-dropdown').classList.toggle('hidden');
});

// accordion functionality
function toggleAccordion(instance, index, iconPath) {
  const content = document.getElementById(`accordion-${instance}-content-${index}`);
  const icon = document.getElementById(`accordion-${instance}-icon-${index}`);
  const openIcon = `<img src="${iconPath}" width="13" height="auto" alt="Open">`;

  if (content.style.maxHeight && content.style.maxHeight !== '0px') {
    content.style.maxHeight = '0';
    icon.innerHTML = openIcon;
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    icon.innerHTML = '';
  }
}

// dropdown functionality
document.querySelectorAll('.dropdown-head').forEach((el) => {
  el.onclick = function () {
    const dropDown = el.parentNode;
    const dropDownOptions = dropDown.querySelector('.dropdown-options');
    dropDown.ariaExpanded = dropDown.ariaExpanded === 'true' ? 'false' : 'true';
    dropDownOptions.classList.toggle('hidden');
  };
});

// collection filter functionality
document.querySelectorAll('.dropdown[data-instance="collection"] .dropdown-options a').forEach((el) => {
  el.onclick = function () {
    collectionGoto(el.dataset.value);
  };
});

// sorting functionality
document.querySelectorAll('.dropdown[data-instance="sort_by"] .dropdown-options a').forEach((el) => {
  el.onclick = function () {
    modifyUrlParams('sort_by', el.dataset.value);
  };
});

// restore add to cart button functionality
let originalAddToCartButton = null;
let addToCartContainer = null;
let restoreTimeout = null;

function restoreAddToCartButton() {
  // Clear any existing timeout
  if (restoreTimeout) {
    clearTimeout(restoreTimeout);
    restoreTimeout = null;
  }

  // Find the add to cart button
  const addToCartButton = document.querySelector('.product-form .add-to-cart');
  if (addToCartButton) {
    // Restore original content if it was stored
    const originalContent = addToCartButton.getAttribute('data-original-content');
    if (originalContent) {
      addToCartButton.innerHTML = originalContent;
      addToCartButton.disabled = false;
      addToCartButton.removeAttribute('data-original-content');
    } else if (originalAddToCartButton) {
      // Fallback to stored original button
      addToCartButton.innerHTML = originalAddToCartButton.innerHTML;
      addToCartButton.disabled = false;
    }
  }
}

function setupProductFormHandler(form) {
  form.onsubmit = function (e) {
    e.preventDefault();

    // Store original button and container before replacing
    const addToCartButton = form.querySelector('.add-to-cart');
    if (addToCartButton && !originalAddToCartButton) {
      originalAddToCartButton = addToCartButton.cloneNode(true);
      addToCartContainer = addToCartButton.parentElement;
    }

    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(form),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const cartQuantities = document.getElementsByClassName('cart-item-count');
        const quantity =
          parseInt(cartQuantities[0].textContent) + parseInt(document.getElementById('quantity-0').value);
        cartQuantities[0].textContent = quantity;
        cartQuantities[1].textContent = quantity;

        // Store original button content and replace text only
        const originalContent = addToCartButton.innerHTML;
        addToCartButton.innerHTML = 'Added to cart.';
        addToCartButton.disabled = true;

        // Store original content for restoration
        addToCartButton.setAttribute('data-original-content', originalContent);

        // Restore button after 3 seconds
        restoreTimeout = setTimeout(() => {
          restoreAddToCartButton();
        }, 3000);
      });
  };
}

// product quantity
document.querySelectorAll('.product-quantity-less').forEach((el) => {
  el.onclick = function (e) {
    e.preventDefault();
    const quantity = document.getElementById('quantity-' + this.dataset.index).value;
    const newQuantity = parseInt(quantity) > 1 ? parseInt(quantity) - 1 : 1;
    document.getElementById('quantity-' + this.dataset.index).value = newQuantity;
    document.getElementById('product-quantity-text-' + this.dataset.index).textContent = newQuantity;

    // Auto-submit cart form if on cart page
    const cartForm = document.getElementById('cart');
    if (cartForm) {
      setTimeout(() => {
        cartForm.submit();
      }, 100);
    } else {
      // Restore add to cart button if quantity changed on product page
      restoreAddToCartButton();
    }
  };
});
document.querySelectorAll('.product-quantity-more').forEach((el) => {
  el.onclick = function (e) {
    e.preventDefault();
    const quantity = document.getElementById('quantity-' + this.dataset.index).value;
    const newQuantity = parseInt(quantity) + 1;
    document.getElementById('quantity-' + this.dataset.index).value = newQuantity;
    document.getElementById('product-quantity-text-' + this.dataset.index).textContent = newQuantity;

    // Auto-submit cart form if on cart page
    const cartForm = document.getElementById('cart');
    if (cartForm) {
      setTimeout(() => {
        cartForm.submit();
      }, 100);
    } else {
      // Restore add to cart button if quantity changed on product page
      restoreAddToCartButton();
    }
  };
});

// cart
document.querySelectorAll('.product-form').forEach((el) => {
  const form = el.querySelector('form');
  setupProductFormHandler(form);
});

// set default address
document.querySelectorAll('.default-address-wrapper form').forEach((form) => {
  form.onsubmit = function (e) {
    e.preventDefault();
    fetch(form.getAttribute('action'), {
      method: 'POST',
      body: new FormData(form),
    })
      .then(function (response) {
        return;
      })
      .then(function (data) {
        window.location.reload();
      });
  };
});

// address province
function generateProvinces(provinces) {
  const provinceList = JSON.parse(provinces);
  const provincesOptions = provinceList.map((province) => `<option value="${province[0]}">${province[1]}</option>`);
  document.getElementById('province').innerHTML = provincesOptions;
}

// sliders
const defaultResponsiveSettings = [
  {
    breakpoint: 1300,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
    },
  },
  {
    breakpoint: 950,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 2,
      centerMode: true,
    },
  },
  {
    breakpoint: 700,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
    },
  },
];
$('#yummi').slick({
  slidesToShow: 1,
  arrows: false,
  dots: false,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 1000,
  vertical: true,
  verticalSwiping: true,
});
$('#top-sellers').slick({
  slidesToShow: 6,
  slidesToScroll: 6,
  arrows: false,
  dots: false,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 2000,
  centerMode: true,
  responsive: defaultResponsiveSettings,
});
$('#reviews').slick({
  slidesToShow: 4,
  slidesToScroll: 4,
  arrows: false,
  dots: false,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 2000,
  responsive: defaultResponsiveSettings,
});
$('#bundles').slick({
  slidesToShow: 5,
  slidesToScroll: 5,
  arrows: false,
  dots: false,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 2000,
  centerMode: true,
  responsive: defaultResponsiveSettings,
});
