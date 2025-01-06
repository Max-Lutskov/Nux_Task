import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const userStore = useUserStore();

	if (!userStore.user && to.path !== '/login') {
		return navigateTo('/login');
	}
});