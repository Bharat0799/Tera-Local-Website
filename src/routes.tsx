import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DealsPage from './pages/DealsPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import SearchPage from './pages/SearchPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: 'Products',
    path: '/products',
    element: <ProductsPage />,
    visible: true
  },
  {
    name: 'Product Detail',
    path: '/products/:slug',
    element: <ProductDetailPage />,
    visible: false
  },
  {
    name: "Today's Deals",
    path: '/deals',
    element: <DealsPage />,
    visible: true
  },
  {
    name: 'About',
    path: '/about',
    element: <AboutPage />,
    visible: true
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <CartPage />,
    visible: false
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <CheckoutPage />,
    visible: false
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccessPage />,
    visible: false
  },
  {
    name: 'Search',
    path: '/search',
    element: <SearchPage />,
    visible: false
  }
];

export default routes;
