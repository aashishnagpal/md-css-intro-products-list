/**
 * Created by Aashish on 1/19/2017.
 */

(function (global) {
  global.promoCodes = {
    'Promo-01': new Promotion('Promo-01', 'HAPPYNEWYEAR', 'percent-off', '15', 'cart'),
    'Promo-02': new Promotion('Promo-02', '20OFF', 'percent-off', '30', 'category'),
    'Promo-03': new Promotion('Promo-03', '25OFF', 'percent-off', '25', 'product'),
    'Promo-04': new Promotion('Promo-04', 'JAN2017', 'value-off', '10', 'category'),
    'Promo-05': new Promotion('Promo-05', 'BESTSELLER', 'value-off', '5', 'product')
  };

  global.categories = {
    'C001': new Category('C001', 'Science & Math', ''),
    'C002': new Category('C002', 'Biographies', ''),
    'C003': new Category('C003', 'Best Sellers', 'Promo-04'),
    'C004': new Category('C004', 'Fiction', 'Promo-02')
  };

  global.products = {
    'P001': new Product(
        'P001',
        21.09,
        'A Brief History of Time',
        'Stephen Hawking',
        '0553380168',
        ['C001', 'C003'],
        'Promo-05'
    ),
    'P002': new Product(
        'P002',
        23.95,
        'A Heartbreaking Work of Staggering Genius',
        'Dave Eggers',
        '0375725784',
        ['C002', 'C003'],
        'Promo-03'
    ),
    // 'P003': new Product(
    //     'P003',
    //     15.18,
    //     'A Long Way Gone: Memoirs of a Boy Soldier',
    //     'Ishmael Beah',
    //     '0374531269',
    //     ['C002', 'C003'],
    //     ''
    // ),
    // 'P004': new Product(
    //     'P004',
    //     12.95,
    //     'The Great Gatsby',
    //     'F. Scott Fitzgerald',
    //     '0743273567',
    //     ['C004', 'C003'],
    //     ''
    // ),
    // 'P005': new Product(
    //     'P005',
    //     15.40,
    //     'Harry Potter and the Cursed Child',
    //     'J.K. Rowling, Jack Thorne, John Tiffany',
    //     '1338099132',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P006': new Product(
    //     'P006',
    //     21.94,
    //     'Harry Potter and the Deathly Hallows',
    //     'J.K. Rowling',
    //     '0545010225',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P007': new Product(
    //     'P007',
    //     16.94,
    //     'Harry Potter and the Half-Blood Prince',
    //     'J.K. Rowling',
    //     '0439784549',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P008': new Product(
    //     'P008',
    //     18.66,
    //     'Harry Potter and the Order of the Phoenix',
    //     'J.K. Rowling',
    //     '0747551006',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P009': new Product(
    //     'P009',
    //     18.39,
    //     'Harry Potter And The Goblet Of Fire',
    //     'J.K. Rowling',
    //     '0439139597',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P010': new Product(
    //     'P010',
    //     15.84,
    //     'Harry Potter And The Prisoner Of Azkaban',
    //     'J.K. Rowling',
    //     '0439136350',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P011': new Product(
    //     'P011',
    //     15.84,
    //     'Harry Potter and the Chamber of Secrets',
    //     'J.K. Rowling',
    //     '0439064864',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // ),
    // 'P012': new Product(
    //     'P012',
    //     15.84,
    //     'Harry Potter And The Sorcerer\'s Stone',
    //     'J.K. Rowling',
    //     '0590353403',
    //     ['C004', 'C003'],
    //     'Promo-03'
    // )
  };


})(window);