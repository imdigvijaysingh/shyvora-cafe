import React from 'react';
import MenuHero from '../components/Menu/MenuHero';
import CategoryFilter from '../components/Menu/CategoryFilter';
import MenuCategoryList from '../components/Menu/MenuCategoryList';
import MenuCta from '../components/Menu/MenuCta';

// Import images
import coffeeImg from '../assets/images/menu_cappuccino_1784782504483.webp';
import breakfastImg from '../assets/images/menu_toast_1784782514646.webp';
import sandwichesImg from '../assets/images/cta_croissant_1784782576636.webp'; // Using croissant for sandwich category
import dessertsImg from '../assets/images/menu_cheesecake_1784782526474.webp';
import beveragesImg from '../assets/images/menu_iced_latte_1784782557336.webp';

const Menu = () => {
  const menuData = {
    coffee: {
      title: "COFFEE",
      image: coffeeImg,
      items: [
        { name: "Espresso", description: "Strong and bold single shot.", price: "129" },
        { name: "Americano", description: "Espresso with hot water.", price: "149" },
        { name: "Cappuccino", description: "Espresso with steamed milk foam.", price: "179" },
        { name: "Latte", description: "Smooth espresso with steamed milk.", price: "179" },
        { name: "Mocha", description: "Chocolate meets coffee perfection.", price: "199" }
      ],
      signatureItems: [
        { name: "Brew & Bloom Special", description: "Our signature house blend.", price: "219" },
        { name: "Caramel Macchiato", description: "Smooth vanilla with caramel.", price: "219" },
        { name: "Hazelnut Latte", description: "Warm, nutty and comforting.", price: "209" },
        { name: "Cold Brew", description: "Slow brewed to perfection.", price: "199" }
      ]
    },
    breakfast: {
      title: "ALL DAY BREAKFAST",
      image: breakfastImg,
      reverse: true,
      items: [
        { name: "Avocado Toast", description: "Fresh avocado, herbs & sourdough.", price: "249", isVeg: true },
        { name: "Classic Pancakes", description: "Fluffy pancakes with maple syrup.", price: "249", isVeg: true },
        { name: "Farmhouse Breakfast", description: "Eggs, toast, grilled veggies & more.", price: "299", isVeg: false },
        { name: "Overnight Oats", description: "Oats, fruits, nuts & honey.", price: "189", isVeg: true }
      ]
    },
    sandwiches: {
      title: "SANDWICHES & WRAPS",
      image: sandwichesImg,
      items: [
        { name: "Grilled Veg Sandwich", description: "Classic veggies with our special spread.", price: "249", isVeg: true },
        { name: "Chicken Pesto Sandwich", description: "Grilled chicken, pesto & cheese.", price: "279", isVeg: false },
        { name: "BBQ Chicken Wrap", description: "Smoky BBQ chicken with fresh greens.", price: "279", isVeg: false },
        { name: "Peri Peri Paneer Wrap", description: "Spicy paneer with crisp veggies.", price: "259", isVeg: true }
      ]
    },
    desserts: {
      title: "DESSERTS",
      image: dessertsImg,
      reverse: true,
      items: [
        { name: "Classic Cheesecake", description: "Creamy & rich New York style.", price: "229" },
        { name: "Chocolate Brownie", description: "Warm brownie with ice cream.", price: "199" },
        { name: "Tiramisu", description: "Coffee layered Italian delight.", price: "229" },
        { name: "Banoffee Pie", description: "Banana, toffee & whipped cream.", price: "219" }
      ]
    },
    beverages: {
      title: "BEVERAGES",
      image: beveragesImg,
      items: [
        { name: "Fresh Lime Soda", description: "Refreshing lime with a zing.", price: "149", isVeg: true },
        { name: "Iced Lemon Tea", description: "Cool, citrusy & refreshing.", price: "149" },
        { name: "Berry Smoothie", description: "Blended berries with yogurt.", price: "199" },
        { name: "Hot Chocolate", description: "Rich chocolatey comfort.", price: "179" }
      ]
    }
  };

  return (
    <>
      <MenuHero />
      <CategoryFilter />
      <MenuCategoryList {...menuData.coffee} />
      <MenuCategoryList {...menuData.breakfast} />
      <MenuCategoryList {...menuData.sandwiches} />
      <MenuCategoryList {...menuData.desserts} />
      <MenuCategoryList {...menuData.beverages} />
      <MenuCta />
    </>
  );
};

export default Menu;
