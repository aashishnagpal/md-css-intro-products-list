/**
 * Created by Aashish on 1/18/2017.
 */

var Category = (function () {

  function Category(id, name, promo) {
    this.id = id;
    this.categoryName = name;
    this.promotionAvailable = promo || ''; // if any category level promotion is available. This value will be promoId
  }

  return Category;
})();