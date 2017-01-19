/**
 * Created by Aashish on 1/18/2017.
 */

var Product = (function () {

  function Product(id, price, name, author, isbn, categories, promo) {
    this.id = id;
    this.price = price || 0.00;
    this.name = name || '';
    this.author = author || '';
    this.isbn = isbn || ''; // URL for the image of the product
    this.categories = categories || [];
    this.promotionAvailable = promo || ''; // if any category level promotion is available. This value will be promoId
  }

  return Product;
})();

// http://images.amazon.com/images/P/{{book.isbn}}.01.jpg