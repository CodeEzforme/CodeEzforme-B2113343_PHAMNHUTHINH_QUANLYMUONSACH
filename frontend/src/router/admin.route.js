const requireAdminAuth = (to, from, next) => {
  try {
    
    const token = document.cookie.split(';').find(cookie => /\btoken\b/.test(cookie));
    if (token) {
      next();
    } else {
      next('/admin/auth/login');
    }
  } catch (error) {
    next('/admin/auth/login');
  }
};

const adminRoutes = [
  {
    path: "/admin/books",
    name: "book",
    component: () => import("@/views/admin/pages/books/Book.vue"),
    beforeEnter: requireAdminAuth
  },
  {
    path: "/admin/books/:id",
    name: "book.edit",
    component: () => import("@/views/admin/pages/books/BookEdit.vue"),
    beforeEnter: requireAdminAuth,
  },
  {
    path: "/admin/books/create",
    name: "book.add",
    component: () => import("@/views/admin/pages/books/CreateBook.vue"),
    beforeEnter: requireAdminAuth,
  },

  {
    path: "/admin/auth/register",
    name: "register",
    component: () => import("@/views/admin/pages/register/Register.vue"),
  },

  {
    path: "/admin/auth/login",
    name: "login",
    component: () => import("@/views/admin/pages/login/Login.vue"),
  },

  {
    path: "/admin/Bill",
    name: "bill",
    component: () => import("@/views/admin/pages/books/Bill.vue"),
  },
];

export default adminRoutes;

