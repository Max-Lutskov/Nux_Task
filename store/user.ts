import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '~/types/types';

export const useUserStore = defineStore('user', () => {
	const user = ref<User | null>(null);
	const error = ref<string | null>(null);

	const router = useRouter();

	const login = async (username: string, phone: string) => {
		try {
			const users: User[] = await $fetch(`${useRuntimeConfig().public.apiBase}/users`);
			const foundUser = users.find((u) => u.username === username && u.phone === phone);

			if (foundUser) {
				localStorage.setItem('user', JSON.stringify(foundUser));
				user.value = foundUser;
				await router.push('/');
			} else {
				error.value = 'Login error';
			}
		} catch (err) {
			error.value = 'An unexpected error occurred during login.';
		}
	};

	const logout = async () => {
		user.value = null;
		localStorage.removeItem('user');
		await router.push('/login');
	};

	const initializeUser = () => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			user.value = JSON.parse(storedUser);
		}
	};

	return {
		user,
		error,
		login,
		logout,
		initializeUser,
	};
});
