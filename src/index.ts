// ---------------------------------------------------------------------------
// КРОК 1: Створення типів товарів
// ---------------------------------------------------------------------------

// Базовий тип, який гарантує, що у будь-якого товару є ID, назва та ціна
type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string; // Опціональне поле
};

// Специфічний тип для електроніки
type Electronics = BaseProduct & {
  category: 'electronics';
  warrantyPeriod: number; // Унікальне поле: гарантія в місяцях
  brand: string;
};

// Специфічний тип для одягу
type Clothing = BaseProduct & {
  category: 'clothing';
  size: 'S' | 'M' | 'L' | 'XL'; // Унікальне поле: розмір
  material: string;
};

// Специфічний тип для книг (додатково, згідно опису завдання)
type Book = BaseProduct & {
  category: 'books';
  author: string;
  pageCount: number;
};

// ---------------------------------------------------------------------------
// КРОК 2: Створення функцій для пошуку та фільтрації
// ---------------------------------------------------------------------------

/**
 * Шукає товар у масиві за ID.
 * Використовує Generic <T>, щоб повернути саме той тип товару, який ми передали,
 * а не просто BaseProduct.
 */
const findProduct = <T extends BaseProduct>(products: T[], id: number): T | undefined => {
  return products.find(product => product.id === id);
};

/**
 * Фільтрує товари, залишаючи лише ті, що дешевші за maxPrice.
 */
const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  return products.filter(product => product.price <= maxPrice);
};

// ---------------------------------------------------------------------------
// КРОК 3: Створення кошика
// ---------------------------------------------------------------------------

type CartItem<T> = {
  product: T;
  quantity: number;
};

/**
 * Додає товар у кошик. 
 * Якщо товар вже є — збільшує кількість.
 * Працює імутабельно (повертає новий масив, не змінюючи старий).
 */
const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T,
  quantity: number
): CartItem<T>[] => {
  // Перевірка на коректність вхідних даних
  if (quantity <= 0) {
    console.warn("Кількість має бути більше 0");
    return cart;
  }

  const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

  if (existingItemIndex !== -1) {
    // Якщо товар вже є, створюємо нову копію кошика з оновленою кількістю
    const newCart = [...cart];
    newCart[existingItemIndex] = {
      ...newCart[existingItemIndex],
      quantity: newCart[existingItemIndex].quantity + quantity
    };
    return newCart;
  } else {
    // Якщо товару немає, додаємо новий
    return [...cart, { product, quantity }];
  }
};

/**
 * Рахує загальну вартість кошика.
 */
const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// ---------------------------------------------------------------------------
// КРОК 4: Демонстрація роботи (Використання)
// ---------------------------------------------------------------------------

console.log("--- ПОЧАТОК ТЕСТУВАННЯ ---");

// 1. Створення тестових даних
const phones: Electronics[] = [
  { id: 1, name: "iPhone 15", price: 40000, category: 'electronics', warrantyPeriod: 12, brand: "Apple" },
  { id: 2, name: "Samsung S24", price: 38000, category: 'electronics', warrantyPeriod: 24, brand: "Samsung" },
  { id: 3, name: "Redmi Note", price: 8000, category: 'electronics', warrantyPeriod: 12, brand: "Xiaomi" }
];

const tshirts: Clothing[] = [
  { id: 10, name: "Футболка біла", price: 500, category: 'clothing', size: "M", material: "Cotton" },
  { id: 11, name: "Джинси", price: 1500, category: 'clothing', size: "L", material: "Denim" }
];

// 2. Тестування пошуку та фільтрації
console.log("\n--- Пошук та Фільтрація ---");
const foundPhone = findProduct(phones, 2); 
// Тут TS знає, що foundPhone - це Electronics (має поле warrantyPeriod)
if (foundPhone) {
  console.log(`Знайдено: ${foundPhone.name}, Гарантія: ${foundPhone.warrantyPeriod} міс.`);
}

const cheapPhones = filterByPrice(phones, 39000);
console.log(`Телефони дешевше 39000: ${cheapPhones.map(p => p.name).join(", ")}`);

// 3. Тестування кошика з ЕЛЕКТРОНІКОЮ
console.log("\n--- Кошик Електроніки ---");
let techCart: CartItem<Electronics>[] = [];

// Додаємо iPhone
const iphone = findProduct(phones, 1);
if (iphone) techCart = addToCart(techCart, iphone, 1);

// Додаємо ще один iPhone (має збільшитись кількість)
if (iphone) techCart = addToCart(techCart, iphone, 2);

// Додаємо Samsung
const samsung = findProduct(phones, 2);
if (samsung) techCart = addToCart(techCart, samsung, 1);

console.log("Вміст Tech кошика:", techCart);
console.log(`Загальна вартість Tech кошика: ${calculateTotal(techCart)} грн`);

// 4. Тестування кошика з ОДЯГОМ
// Generic не дозволить додати телефон у кошик для одягу, що забезпечує типобезпеку!
console.log("\n--- Кошик Одягу ---");
let clothesCart: CartItem<Clothing>[] = [];

const shirt = findProduct(tshirts, 10);
if (shirt) {
    clothesCart = addToCart(clothesCart, shirt, 5); // 5 футболок
    // TS тут підказує, що shirt.size існує
    console.log(`Додано: ${shirt.name}, Розмір: ${shirt.size}`);
}

console.log(`Загальна вартість Clothes кошика: ${calculateTotal(clothesCart)} грн`);