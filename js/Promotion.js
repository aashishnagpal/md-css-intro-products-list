/**
 * Created by Aashish on 1/18/2017.
 */

var Promotion = (function () {

  function Promotion(id, promoCode, type, discount, applicableOn) {
    this.id = id;
    this.promoCode = promoCode;
    this.discountType = type || 'value-off'; // 'value-off' OR 'percent-off'
    this.discount = discount || 0.0; // actual value or percent that is to be deducted
    this.applicableOn = applicableOn || 'cart'; // default='cart', other values can be 'product' or 'category'
  }

  return Promotion;
})();