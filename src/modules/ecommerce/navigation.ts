import type { NavigationLink } from "@/config/navigation-types";

// Presentation routes only; this manifest does not grant API permissions.
export const ecommerceNavigation: NavigationLink[] = [
  {
    "key": "products",
    "path": "/ecommerce/products"
  },
  {
    "key": "categories",
    "path": "/ecommerce/categories"
  },
  {
    "key": "brands",
    "path": "/ecommerce/brands"
  },
  {
    "key": "orders",
    "path": "/ecommerce/orders"
  },
  {
    "key": "customers",
    "path": "/ecommerce/customers"
  },
  {
    "key": "payments",
    "path": "/ecommerce/payments"
  }
];
