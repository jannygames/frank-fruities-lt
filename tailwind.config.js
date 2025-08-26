/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.liquid'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: {
        'bts-blue': '#404A9E',
        'bts-yellow': '#C9DF24',
        'bts-bg': '#F5F5F5',
        'bts-gray': '#6F6F6F',
      },
      backgroundImage: {
        'bigblock-union': "url('bigblock-union.svg')",
        'menu-icon': "url('menu-icon.svg')",
        'search-icon': "url('search-icon.svg')",
        'account-icon': "url('account-icon.svg')",
        'cart-icon': "url('cart-icon.svg')",
        'best-tasting-union': "url('best-tasting-union.svg')",
        'best-tasting-product': "url('best-tasting-product.webp')",
        'look-forward-union1': "url('look-forward-union1.webp')",
        'look-forward-union2': "url('look-forward-union2.webp')",
        'excellence-union1': "url('excellence-union1.svg')",
        'excellence-union2': "url('excellence-union2.svg')",
        'excellence-back': "url('excellence-back.webp')",
        'crafted-union1': "url('crafted-union1.svg')",
        'crafted-union2': "url('crafted-union2.svg')",
        'crafted-back': "url('crafted-back.webp')",
        'takestep-union1': "url('takestep-union1.svg')",
        'takestep-union2': "url('takestep-union2.svg')",
        'school-benefits-bg': "url('school-benefits-bg.png')",
        'benefits-bg-mobile': "url('benefits-bg-mobile.png')",
        dropdown: "url('dropdown-arrow.svg')",
        'frank-help-gut-1000': "url('frank-help-gut-1000.webp')",
        'frank-help-gut-700': "url('frank-help-gut-700.webp')",
        'frank-help-gut-500': "url('frank-help-gut-500.webp')",
        'shape-bite': "url('shape-bite.webp')",
      },
    },
  },
  plugins: [],
};
