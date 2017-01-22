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
    this.itemPromoApplied = '';
    this.savings = 0.00;
    this.netPrice = product.price;
  }

  var ProductProtoCopy = Object.create(Product.prototype);
  ProductProtoCopy.constructor = CartItem;
  CartItem.prototype = ProductProtoCopy;

  function Cart(orderId) {
    this.orderId = orderId;
    this.items = {};
    this.itemCount = 0;
    this.totalPrice = 0.00; // before any offers applied
    this.netPrice = 0.00; // after promotions applied
    this.savings = 0.00; // totalPrice - netPrice

    // only one promo code can be applied, this value will be promoId.
    // details of promo should be read from promo array
    this.promoApplied = '';

    var self = this;
    var updateItemCount = function () {
      var items = self.items;
      self.itemCount = 0;
      for (var id in items) {
        if (items.hasOwnProperty(id)) {
          self.itemCount += items[id].qty;
        }
      }
    };

    var updateCartTotals = function () {
      var items = self.items;
      self.totalPrice = 0.0;
      self.savings = 0.0;
      self.netPrice = 0.0;
      for (var id in items) {
        if (items.hasOwnProperty(id)) {
          self.totalPrice += items[id].price * items[id].qty;
          self.savings += items[id].savings * items[id].qty;
          self.netPrice += items[id].netPrice * items[id].qty;
        }
      }
    };

    var calcNetPrice = function (type, discount, amount) {
      if (type === 'percent-off') {
        return (1.00 - (discount / 100)) * amount;
      } else if (type === 'value-off') {
        return (1.00 * amount) - (1.00 * discount);
      }
    };

    var decimalRoundOff = function (value) {
      return +(value.toFixed(2));
    };

    this.addItem = function (productId, qty) {
      qty = +qty;
      var cartItemId = 'CI' + productId.slice(1);
      if (!this.updateItem(cartItemId, qty, 'add')) {
        this.items[cartItemId] = new CartItem(productsData[productId], qty);
      }
      updateItemCount();
      updateCartTotals();
      return this.items[cartItemId];
    };

    this.updateItem = function (itemId, qty, updateOperation) {
      var updated = false;
      qty = +qty;
      if (itemId in this.items) {
        if (updateOperation === 'add') {
          var currentQty = this.items[itemId].qty;
          var newQty = currentQty + qty;
          this.items[itemId].qty = (newQty <= 999) ? newQty : 999;
        } else if (updateOperation === 'replace') {
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
        updateItemCount();
        updateCartTotals();
      }
    };

    var isNewPromotionCheaper = function (promoId) {
      var retVal = {
        cartItemsCopy: JSON.parse(JSON.stringify(self.items)),
        isCheaper: false
      };
      if (self.promoApplied !== promoId) {
        var promoToApply = promotionsData[promoId];
        var newNetPrice = 0.00;
        for (var itemId in retVal.cartItemsCopy) {
          if (retVal.cartItemsCopy.hasOwnProperty(itemId)) {
            var item = retVal.cartItemsCopy[itemId];
            item.itemPromoApplied = '';
            item.netPrice = item.price;
            item.savings = 0.00;

            if (promoToApply.applicableOn === 'cart') {
              item.itemPromoApplied = promoId;
              item.netPrice = decimalRoundOff(calcNetPrice(promoToApply.discountType, promoToApply.discount, item.price));
              item.savings = decimalRoundOff(item.price - item.netPrice);
            }
            else if (promoToApply.applicableOn === 'category') {
              item.categories.forEach(function (catId) {
                if (catId in categoriesData && categoriesData[catId].promotionAvailable === promoId) {
                  item.itemPromoApplied = promoId;
                  item.netPrice = decimalRoundOff(calcNetPrice(promoToApply.discountType, promoToApply.discount, item.price));
                  item.savings = decimalRoundOff(item.price - item.netPrice);
                }
              });
            }
            else if (promoToApply.applicableOn === 'product') {
              if (item.promotionAvailable === promoId) {
                item.itemPromoApplied = promoId;
                item.netPrice = decimalRoundOff(calcNetPrice(promoToApply.discountType, promoToApply.discount, item.price));
                item.savings = decimalRoundOff(item.price - item.netPrice);
              }
            }
          }
        }
        for (var id in retVal.cartItemsCopy) {
          if (retVal.cartItemsCopy.hasOwnProperty(id)) {
            newNetPrice += retVal.cartItemsCopy[id].netPrice * retVal.cartItemsCopy[id].qty;
          }
        }
        retVal.isCheaper = (newNetPrice < self.netPrice);
      }
      return retVal;
    };

    this.applyPromotionCode = function (promoId) {
      var compared = isNewPromotionCheaper(promoId);
      if (compared.isCheaper) {
        this.promoApplied = promoId;
        this.items = JSON.parse(JSON.stringify(compared.cartItemsCopy));
        updateCartTotals();
      }
      return compared.isCheaper;
    };
  }

  return Cart;
})
();