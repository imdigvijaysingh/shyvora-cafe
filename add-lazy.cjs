const fs = require('fs');
const files = [
  'src/components/InstagramFeed.jsx',
  'src/components/SplitCta.jsx',
  'src/components/About/OurStory.jsx',
  'src/components/About/Team.jsx',
  'src/components/About/Testimonials.jsx',
  'src/components/Menu/MenuCategoryList.jsx',
  'src/components/Menu/MenuCta.jsx',
  'src/components/OrderOnline/OrderItemCard.jsx',
  'src/components/BookTable/PreferredArea.jsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/<img(?!\s+loading=)/g, '<img loading="lazy"');
  fs.writeFileSync(f, c);
  console.log('Updated ' + f);
});
