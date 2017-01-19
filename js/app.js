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
    for (var productId in products) {
      if (products.hasOwnProperty(productId)) {
        var template = document.querySelector('#product-template').cloneNode(true);
        template.removeAttribute('id');

        var product = products[productId];
        template.querySelector('.img-container img').src = getImgUrl(product.isbn);

        var productDescriptors = template.querySelectorAll('.description-container p');
        productDescriptors[0].innerText = product.name;
        productDescriptors[1].innerText = product.author;

        var promo = promoCodes[product.promotionAvailable] || {};
        template.querySelector('.promoCode').innerHTML = (promo.promoCode || '') + '&nbsp;&nbsp;';

        var discountDetail = template.querySelector('.discount-rate');
        discountDetail.classList.remove('value-off');
        discountDetail.classList.remove('percent-off');
        if (promo.discountType)
          discountDetail.classList.add(promo.discountType);
        discountDetail.innerHTML = (promo.discount || '');

        template.querySelector('.price').innerText = product.price.toFixed(2);

        var qtyInput = template.querySelector('input');
        qtyInput.setAttribute('id', 'qty-' + productId);
        qtyInput.setAttribute('name', 'qty-' + productId);

        var addToCartButton = template.querySelector('button');
        addToCartButton.setAttribute('id', 'add-' + productId);
        addToCartButton.addEventListener('click', function () {
          var productIdToAdd = this.id.split('-')[1];
          var qty = document.getElementById('qty-' + productIdToAdd).value;
          var cartItem = cart.addItem(productIdToAdd, qty);
          populateCartRow(cartItem);
          updateCartSummary();
        });
        container.appendChild(template);
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
        var itemIdToUpdate = this.id.split('-')[2];
        var qty = this.value;
        cart.updateItem(itemIdToUpdate, qty, 'replace');
        rowTemplate.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);
        updateCartSummary();
      });

      var removeItemLink = rowTemplate.querySelector('.cart-qty-container a');
      removeItemLink.setAttribute('id', 'remove-' + item.id);
      removeItemLink.addEventListener('click', function () {
        console.log(this.id);
        var itemIdToRemove = this.id.split('-')[1];
        cart.removeItem(itemIdToRemove);
        removeCartRow(itemIdToRemove);
        updateCartSummary();
      });

      rowTemplate.querySelector('.cart-price').innerText = item.netPrice.toFixed(2);
      rowTemplate.querySelector('.cart-subtotal').innerText = (item.netPrice * item.qty).toFixed(2);
      /*<div class="cart-price-offer-container">
       <p class="cart-price">99.99</p>
       <p class="selling-price-if-offer">199.99</p>
       <p class="offer-savings-if-offer">100.00</p>
       </div>
       <div class="cart-subtotal-container">
       <p class="cart-subtotal">99.99</p>
       </div>*/
      table.insertBefore(rowTemplate, footer);
    }
  };

  var removeCartRow = function (itemId) {
    var table = document.getElementById('cart-items');
    var row = document.getElementById('row-' + itemId);

    table.removeChild(row);
  };

  // Update cart-summary
  var updateCartSummary = function () {
    document.getElementById('cart-item-count').innerText = (cart.itemCount).toString();
    document.getElementById('cart-sum-total').innerText = (cart.netPrice).toFixed(2);
    document.querySelector('.total-savings p').innerText = (cart.savings).toFixed(2);
    document.querySelector('.estimated-total p').innerText = (cart.netPrice).toFixed(2);
  };

  // // Add click event listener to each add to cart button
  // var addClickEventToButtons = function () {
  //   var productContainer = document.getElementById('products-container');
  //   Array.prototype.forEach.call(productContainer.getElementsByClassName('add-to-cart'), function (button) {
  //     button.addEventListener('click', function () {
  //       var productIdToAdd = this.id.split('-')[1];
  //       var qty = document.getElementById('qty-' + productIdToAdd).value;
  //       var cartItem = cart.addItem(productIdToAdd, qty);
  //       populateCartItemRow(cartItem);
  //       updateCartSummary();
  //     });
  //   });
  // };

  var init = function () {
    // initialize cart
    window.cart = new Cart('order-001');
    populateProductsPage();
  };
  init();
})();