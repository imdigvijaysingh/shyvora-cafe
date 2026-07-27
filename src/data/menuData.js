import coffeeImg from '../assets/images/menu_cappuccino_1784782504483.png';
import breakfastImg from '../assets/images/menu_toast_1784782514646.png';
import sandwichImg from '../assets/images/cta_croissant_1784782576636.png';
import dessertImg from '../assets/images/menu_cheesecake_1784782526474.png';
import beverageImg from '../assets/images/menu_iced_latte_1784782557336.png';

export const menuDatabase = [
  {
    id: 'c1',
    title: "Cappuccino",
    description: "Rich espresso with steamed milk foam.",
    price: 199,
    category: "Coffee",
    type: "Hot",
    isVeg: true,
    image: coffeeImg,
    keywords: ["coffee", "hot", "espresso", "milk", "cappuccino", "brew"]
  },
  {
    id: 'c2',
    title: "Iced Cappuccino",
    description: "Chilled cappuccino with a smooth & frothy finish.",
    price: 219,
    category: "Coffee",
    type: "Iced",
    isVeg: true,
    image: coffeeImg,
    keywords: ["coffee", "cold", "iced", "espresso", "milk", "cappuccino"]
  },
  {
    id: 'c3',
    title: "Hazelnut Cappuccino",
    description: "Cappuccino with a hint of hazelnut sweetness.",
    price: 239,
    category: "Coffee",
    type: "Hot",
    isVeg: true,
    image: coffeeImg,
    keywords: ["coffee", "hot", "hazelnut", "sweet", "nutty", "cappuccino"]
  },
  {
    id: 'c4',
    title: "Caramel Cappuccino",
    description: "Creamy cappuccino topped with caramel drizzle.",
    price: 239,
    category: "Coffee",
    type: "Hot",
    isVeg: true,
    image: coffeeImg,
    keywords: ["coffee", "hot", "caramel", "sweet", "cappuccino", "drizzle"]
  },
  {
    id: 'b1',
    title: "Avocado Toast",
    description: "Fresh avocado, herbs & sourdough.",
    price: 249,
    category: "Breakfast",
    type: "Hot",
    isVeg: true,
    image: breakfastImg,
    keywords: ["breakfast", "avocado", "toast", "healthy", "vegan", "bread"]
  },
  {
    id: 'b2',
    title: "Iced Caramel Latte",
    description: "Smooth espresso with caramel over ice.",
    price: 219,
    category: "Beverages",
    type: "Iced",
    isVeg: true,
    image: beverageImg,
    keywords: ["coffee", "latte", "iced", "cold", "caramel", "sweet", "beverage"]
  },
  {
    id: 's1',
    title: "Pesto Chicken Sandwich",
    description: "Grilled chicken, basil pesto, cheese, toasted bread.",
    price: 279,
    category: "Sandwiches",
    type: "Hot",
    isVeg: false,
    image: sandwichImg,
    keywords: ["sandwich", "chicken", "pesto", "nonveg", "meat", "grilled", "bread"]
  },
  {
    id: 'p1',
    title: "Aglio Olio Pasta",
    description: "Garlic, olive oil, chili flakes, parmesan.",
    price: 259,
    category: "Pasta",
    type: "Hot",
    isVeg: true,
    image: coffeeImg, // Placeholder for pasta
    keywords: ["pasta", "garlic", "spicy", "italian", "noodles", "aglio", "olio"]
  },
  {
    id: 'd1',
    title: "Chocolate Brownie",
    description: "Warm brownie with ice cream.",
    price: 199,
    category: "Desserts",
    type: "Hot",
    isVeg: true,
    image: dessertImg,
    keywords: ["dessert", "chocolate", "sweet", "brownie", "ice cream", "cake"]
  },
  {
    id: 'd2',
    title: "Classic Cheesecake",
    description: "Creamy, rich & perfectly sweet.",
    price: 239,
    category: "Desserts",
    type: "Hot",
    isVeg: true,
    image: dessertImg,
    keywords: ["dessert", "cheese", "cake", "sweet", "creamy"]
  },
  {
    id: 'bev1',
    title: "Berry Smoothie",
    description: "Blended berries with yogurt.",
    price: 199,
    category: "Beverages",
    type: "Iced",
    isVeg: true,
    image: beverageImg,
    keywords: ["beverage", "smoothie", "berry", "cold", "fruit", "healthy", "sweet"]
  }
];

export const searchMenu = (query) => {
  if (!query) return menuDatabase;
  const lowerQuery = query.toLowerCase();
  
  return menuDatabase.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const descMatch = item.description.toLowerCase().includes(lowerQuery);
    const keywordMatch = item.keywords.some(kw => kw.toLowerCase().includes(lowerQuery));
    const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
    
    return titleMatch || descMatch || keywordMatch || categoryMatch;
  });
};
