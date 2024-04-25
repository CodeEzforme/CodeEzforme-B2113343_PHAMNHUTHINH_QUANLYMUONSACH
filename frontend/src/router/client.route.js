const requireClientAuth = (to, from, next) => {
  try {
    const token = document.cookie.split('; ').find(row => row.startsWith('tokenUser')).split('=')[1];
    if (token) {
      next();
    } else {
      next('/auth/login');
    }
  } catch (error) {
    next('/auth/login');
  }
};


const clientRoutes = [
  {
    path: "/books",
    name: "book-client",
    component: () => import("@/views/client/pages/books/ClientBook.vue"),
    beforeEnter: requireClientAuth
  },

  {
    path: "/reader/register",
    name: "register-client",
    component: () => import("@/views/client/pages/register/ClientRegister.vue"),
  },

  {
    path: "/auth/login",
    name: "login-client",
    component: () => import("@/views/client/pages/login/ClientLogin.vue"),
  },

  {
    path: "/borrowBook/:id",
    name: "borrow-book",
    component: () => import("@/views/client/pages/books/borrowBook.vue"),
  },

  {
    path: "/listBorrow",
    name: "borrow-list",
    component: () => import("@/views/client/pages/books/ListborrowBook.vue"),
  },
];

export default clientRoutes;