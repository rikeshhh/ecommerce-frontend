`````markdown
# **E-Commerce Site with Admin Dashboard - Next.js, Tailwind CSS, TypeScript**

A modern e-commerce platform built with **Next.js**, **Tailwind CSS**, and **TypeScript**. Includes a **customer-facing website** and an **admin dashboard** for managing products, orders, and users.

---

## **Features**

### **Customer-Facing Website**

- **Home Page**: Showcases **featured products** and **promotions**.
- **Product Listing Page**: Displays all products with **filters** and **sorting options**.
- **Product Detail Page**: Provides detailed information about a specific product.
- **Cart Page**: Displays items added to the cart and allows users to proceed to **checkout**.
- **Checkout Page**: Allows users to enter **shipping** and **payment details**.
- **User Account Page**: Allows users to view and manage their **account details**, **orders**, and **wishlist**.
- **Authentication**: **Login**, **signup**, and **forgot password** functionality.

### **Admin Dashboard**

- **Dashboard**: Overview of key metrics (e.g., **sales**, **orders**, **users**).
- **Products Management**: Add, edit, and delete **products**.
- **Orders Management**: View and manage **orders**.
- **Users Management**: View and manage **users**.
- **Categories Management**: Add, edit, and delete **product categories**.
- **Promotions Management**: Manage **promotions** and **discounts**.
- **Reports**: View **sales**, **user**, and **product reports**.
- **Settings**: Configure **website settings** (e.g., **payment gateway**, **shipping**).

---

## **Technologies Used**

- **Frontend**: **Next.js**, **Tailwind CSS**, **Shadcn/ui**
- **State Management**: **React Context**, **Zustand**
- **Authentication**: **NextAuth.js**, **Firebase**
- **API Integration**: **Next.js API Routes**, **tRPC**
- **Testing**: **Jest**, **Cypress**, **Playwright**
- **Deployment**: **Vercel**, **Netlify**, **AWS**

---

````markdown
## **Folder Structure**

| Folder/File          | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `public/`            | Static assets (images, icons, fonts)                   |
| `src/`               | Source code for the application                        |
| `src/app/`           | App Router (Next.js 13+)                               |
| `src/app/(auth)/`    | Auth-related routes (login, signup, forgot password)   |
| `src/app/(admin)/`   | Admin dashboard routes (dashboard, products, orders)   |
| `src/app/(main)/`    | Main site routes (home, products, cart)                |
| `src/app/api/`       | API routes (auth, products, orders)                    |
| `src/app/layout.tsx` | Root layout for the application                        |
| `src/app/page.tsx`   | Home page                                              |
| `src/components/`    | Reusable UI components (header, footer, product card)  |
| `src/hooks/`         | Custom React hooks (useCart, useAuth)                  |
| `src/lib/`           | Utility functions and libraries (apiClient, authUtils) |
| `src/contexts/`      | React contexts (AuthContext, CartContext)              |
| `src/styles/`        | Global and module styles (globals.css, theme.css)      |
| `src/types/`         | TypeScript types and interfaces (product.ts, order.ts) |

---

## **Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/my-ecommerce-site.git
cd my-ecommerce-site
```
````
`````

2. Install Dependencies

```bash
npm install
```

3. Set Up Environment Variables
   Create a .env.local file and add the following variables:

env

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:5001
```

4. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the project.

Deployment

1. Build the Project

```bash
npm run build
```

2. Deploy to Vercel
   Install the Vercel CLI:

```bash
npm install -g vercel
Deploy the project:
```
