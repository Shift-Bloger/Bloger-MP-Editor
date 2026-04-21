import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "@/views/home/home.vue";

const routes = [{ path: "/", component: HomeView }];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router;
