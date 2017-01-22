/**
 * Created by Aashish on 1/17/2017.
 */

(function () {
  // Populate the page with products based on json
  var getImgUrl = function (isbn) {
    return (isbn ? 'http://images.amazon.com/images/P/' + isbn : 'http://placehold.it/200x240');
  };

  var populateProductsPage = function () {
    var container = document.getElementById('products-container');
    for (var productId in productsData) {
      if (productsData.hasOwnProperty(productId)) {
        var template = document.querySelector('#product-template').cloneNode(true);
        template.removeAttribute('id');

        var product = productsData[productId];
        template.querySelector('.img-container img').src = getImgUrl(product.isbn);

        var productDescriptors = template.querySelectorAll('.description-container p');
        productDescriptors[0].innerText = product.name;
        productDescriptors[1].innerText = product.author;

        var promo = promotionsData[product.promotionAvailable];
        var categoryDescriptor = template.querySelector('.description-container .categories');
        product.categories.forEach(function (catId) {
          var category = categoriesData[catId];
          var spanNode = document.createElement('span');
          spanNode.innerText = category.categoryName;
          categoryDescriptor.appendChild(spanNode);

          if (!promo) {
            promo = promotionsData[category.promotionAvailable];
          }
        });

        if (promo) {
          template.querySelector('.promoCode').innerHTML = promo.code || '';

          var discountDetail = template.querySelector('.discount-rate');
          discountDetail.classList.remove('value-off');
          discountDetail.classList.remove('percent-off');
          if (promo.discountType)
            discountDetail.classList.add(promo.discountType);
          discountDetail.innerHTML = (promo.discount || '');
        }
        template.querySelector('.price').innerText = product.price.toFixed(2);

        var qtyInput = template.querySelector('input');
        qtyInput.setAttribute('id', 'qty-' + productId);
        qtyInput.setAttribute('name', 'qty-' + productId);
        qtyInput.addEventListener('change', function () {
          if (this.value < 1) this.value = 1;
          else if (this.value > 999) this.value = 999;
        });

        var addToCartButton = template.querySelector('button');
        addToCartButton.setAttribute('id', 'add-' + productId);
        addToCartButton.addEventListener('click', function () {
          var productIdToAdd = this.id.split('-')[1];
          var qty = document.getElementById('qty-' + productIdToAdd).value;
          var cartItem = cart.addItem(productIdToAdd, qty);
          populateCartRow(cartItem);
          updateCartAndCartSummary();
        });
        container.appendChild(template);
      }
    }
  };

  var showHideCartAndButtons = function () {
    var sectionCart = document.getElementById('cart');
    var cartHideButton = document.querySelector('.hide-button');
    var cartShowButton = document.querySelector('.show-button');
    if (cart.items.length === 0) {
      sectionCart.classList.remove('show');
      if (cartHideButton.classList.contains('visible'))
        document.querySelector('.hide-button').classList.remove('visible');
      if (!cartShowButton.classList.contains('visible'))
        document.querySelector('.show-button').classList.remove('visible');
    } else {
      if (!cartHideButton.classList.contains('visible') && !cartShowButton.classList.contains('visible')) {
        cartShowButton.classList.add('visible');
        cartShowButton.click();
      }
    }
  };

  var populateCartRow = function (item) {
    var table = document.getElementById('cart-items');
    var rowId = 'row-' + item.id;
    var row = table.querySelector('#' + rowId);
    if (row) {
      row.querySelector('.cart-qty-container input').value = item.qty;
      row.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);
    } else {
      var footer = table.getElementsByClassName('table-footer')[0];

      var rowTemplate = document.getElementById('cart-row-template').cloneNode(true);
      rowTemplate.setAttribute('id', 'row-' + item.id);
      rowTemplate.querySelector('.cart-img-container img').src = getImgUrl(item.isbn);

      var productDescriptors = rowTemplate.querySelectorAll('.cart-description-container p');
      productDescriptors[0].innerText = item.name;
      productDescriptors[1].innerText = item.author;


      var cartQtyInput = rowTemplate.querySelector('.cart-qty-container input');
      cartQtyInput.setAttribute('id', 'cart-qty-' + item.id);
      cartQtyInput.setAttribute('name', 'cart-qty-' + item.id);
      cartQtyInput.value = item.qty;
      cartQtyInput.addEventListener('change', function () {
        if (this.value <= 0)
          this.value = 0;
        else if (this.value > 999)
          this.value = 999;
        var itemIdToUpdate = this.id.split('-')[2];
        var qty = +this.value;
        cart.updateItem(itemIdToUpdate, qty, 'replace');
        if (qty === 0)
          removeCartRow(itemIdToUpdate);
        else {
          var row = table.querySelector('#' + rowId);
          var item = cart.items[itemIdToUpdate];
          row.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);
        }
        updateCartAndCartSummary();
      });

      var removeItemLink = rowTemplate.querySelector('.cart-qty-container a');
      removeItemLink.setAttribute('id', 'remove-' + item.id);
      removeItemLink.addEventListener('click', function () {
        console.log(this.id);
        var itemIdToRemove = this.id.split('-')[1];
        cart.removeItem(itemIdToRemove);
        removeCartRow(itemIdToRemove);
        updateCartAndCartSummary();
      });

      rowTemplate.querySelector('.cart-price').innerText = item.netPrice.toFixed(2);
      rowTemplate.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);

      table.insertBefore(rowTemplate, footer);
    }
  };

  var updateCartRows = function () {
    var table = document.getElementById('cart-items');
    var rows = table.querySelectorAll('.row-item:not(#cart-row-template)');
    if (rows && rows.length) {
      Array.prototype.forEach.call(rows, function (row) {
        var item = cart.items[row.id.split('-')[1]];
        row.querySelector('.cart-price').innerText = item.netPrice.toFixed(2);
        row.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);

        if (item.netPrice !== item.price) {
          if (item.itemPromoApplied) {
            var itemPromoApplied = promotionsData[item.itemPromoApplied];

            var discountDetail = row.querySelector('.promo-applied');
            discountDetail.classList.remove('value-off');
            discountDetail.classList.remove('percent-off');
            if (itemPromoApplied.discountType)
              discountDetail.classList.add(itemPromoApplied.discountType);
            discountDetail.innerHTML = '<span>' + (itemPromoApplied.discount || '');
          }
          row.querySelector('.selling-price-if-offer').innerText = item.price.toFixed(2);
          row.querySelector('.offer-savings-if-offer').innerText = item.savings.toFixed(2);
        } else {
          row.querySelector('.promo-applied').innerHTML = '';
          row.querySelector('.selling-price-if-offer').innerText = '';
          row.querySelector('.offer-savings-if-offer').innerText = '';
        }
      });
    }
  };

  var removeCartRow = function (itemId) {
    var table = document.getElementById('cart-items');
    var row = document.getElementById('row-' + itemId);
    table.removeChild(row);
    showHideCartAndButtons();
  };

  // Update cart and cart-summary
  var updateCartAndCartSummary = function () {
    document.getElementById('cart-item-count').innerText = (cart.itemCount).toString();
    document.getElementById('cart-sum-total').innerText = (cart.netPrice).toFixed(2);
    document.querySelector('.total-savings p').innerText = (cart.savings).toFixed(2);
    document.querySelector('.estimated-total p').innerText = (cart.netPrice).toFixed(2);
    showHideCartAndButtons();
  };

  var populatePromotionsList = function () {
    for (var promo in promotionsData) {
      if (promotionsData.hasOwnProperty(promo)) {
        var option = document.createElement('option');
        option.setAttribute('value', promotionsData[promo].code);
        option.setAttribute('id', promotionsData[promo].id);
        document.getElementById('promos').appendChild(option);

        var li = document.createElement('li');
        li.innerHTML = '<strong>' + promotionsData[promo].code + '</strong> ' +
            (promotionsData[promo].discountType === 'value-off' ? '$' : '') +
            promotionsData[promo].discount +
            (promotionsData[promo].discountType === 'percent-off' ? '%' : '') +
            ' Off ';
        if (promotionsData[promo].applicableOn === 'cart') {
          li.innerHTML += 'your enitre cart.'
        } else if (promotionsData[promo].applicableOn === 'category') {
          li.innerHTML += 'a category (apply to check).'
        } else if (promotionsData[promo].applicableOn === 'product') {
          li.innerHTML += 'certain products (apply to check).'
        }
        document.getElementById('promotions-tooltip').appendChild(li);
      }
    }
  };

  var applyPromotion = function () {
    var promotion = document.getElementById('promo-code');

    var promoId = '';
    var options = promotion.list.options;
    for (var j = 0, optionsLen = options.length; j < optionsLen; j++) {
      if (promotion.value == options[j].value) {
        promoId = options[j].id;
        break;
      }
    }

    if (promoId && (promoId in promotionsData)) {
      document.getElementById('invalid-promo').innerText = '';
      cart.applyPromotionCode(promoId);
      updateCartRows();
      updateCartAndCartSummary();
    } else {
      document.getElementById('invalid-promo').innerText = 'Please use a valid promocode.';
    }
  };

  (function () {
    var sectionCart = document.getElementById('cart');
    var cartHideButton = document.querySelector('.hide-button');
    var cartShowButton = document.querySelector('.show-button');
    cartHideButton.addEventListener('click', function () {
      document.getElementById('go-to-products').click();
      this.classList.toggle('visible');
      cartShowButton.classList.toggle('visible');
      sectionCart.classList.toggle('show');
    });

    cartShowButton.addEventListener('click', function () {
      this.classList.toggle('visible');
      cartHideButton.classList.toggle('visible');
      sectionCart.classList.toggle('show');
      document.getElementById('go-to-cart').click();
    });
  })();

  var init = function () {
    // initialize cart
    window.cart = new Cart('order-001');
    populateProductsPage();
    populatePromotionsList();
    document.getElementById('apply-promo-code').addEventListener('click', applyPromotion);
  };
  init();
})();