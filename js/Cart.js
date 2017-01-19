/**
 * Created by Aashish on 1/18/2017.
 */

var Cart = (function () {

  function CartItem(product, qty) {
    Product.call(this,
        'CI' + product.id.slice(1),
        product.price,
        product.name,
        product.author,
        product.isbn,
        product.categories,
        product.promotionAvailable
    );
    this.qty = qty;
    this.offerApplied = '';
    this.savings = 0.00;
    this.netPrice = product.price;
  }

  var ProductProtoCopy = Object.create(Product.prototype);
  ProductProtoCopy.constructor = CartItem;
  CartItem.prototype = ProductProtoCopy;

  function Cart(orderId) {
    var self = this;
    var updateItemCount = function () {
      self.itemCount = Object.keys(self.items).length;
    };

    var updateCartTotals = function () {
      var items = self.items;
      self.totalPrice = 0;
      self.savings = 0;
      self.netPrice = 0;
      for (var id in items) {
        if (items.hasOwnProperty(id)) {
          self.totalPrice += items[id].price * items[id].qty;
          self.savings += items[id].savings * items[id].qty;
          self.netPrice += items[id].netPrice * items[id].qty;
        }
      }
    };

    this.orderId = orderId;
    this.items = {};
    this.itemCount = 0;
    this.totalPrice = 0.00; // before any offers applied
    this.netPrice = 0.00; // after promotions applied
    this.savings = 0.00; // totalPrice - netPrice

    // only one promo code can be applied, this value will be promoId.
    // details of promo should be read from promo array
    this.promoApplied = '';

    this.addItem = function (productId, qty) {
      qty = +qty;
      var cartItemId = 'CI' + productId.slice(1);
      if (!this.updateItem(cartItemId, qty, 'add')) {
        this.items[cartItemId] = new CartItem(products[productId], qty);
      }
      updateItemCount();
      updateCartTotals();
      return this.items[cartItemId];
    };

    this.updateItem = function (itemId, qty, updateOperation) {
      var updated = false;
      qty = +qty;
      if (itemId in this.items) {
        if (updateOperation === 'add')
          this.items[itemId].qty += qty;
        else if (updateOperation === 'replace') {
          if (qty === 0)
            this.removeItem(itemId);
          else
            this.items[itemId].qty = qty;
        }
        updateItemCount();
        updateCartTotals();
        updated = true;
      }

      return updated;
    };

    this.removeItem = function (itemId) {
      if (itemId in this.items) {
        delete this.items[itemId];
      }
    };

    this.applyPromotionCode = function (promoId) {

    };


  }

  return Cart;
})();