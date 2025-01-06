import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';
import { useUserStore } from '~/store/user';
import type { Todo } from '~/types/types';
import { TodoStatus } from '~/types/types';

export const useTodoStore = defineStore('todo', () => {
	const todos = ref<Todo[]>([]);
	const favorites = ref<Record<number, number[]>>(
		JSON.parse(localStorage.getItem('favorites') || '{}')
	);
	const filters = reactive({
		status: TodoStatus.All,
		search: '',
		id: 'All users',
	});
	const loading = ref(true);

	const addTodo = (userId: number, title: string) => {
		const newTodo: Todo = {
			id: userId,
			userId,
			title,
			completed: false,
		};
		todos.value = [newTodo, ...todos.value];
	};

	const fetchTodos = async () => {
		loading.value = true;
		try {
			todos.value = await $fetch<Todo[]>(
				`${useRuntimeConfig().public.apiBase}/todos`
			);
		} finally {
			loading.value = false;
		}
	};

	const toggleFavorite = (userId: number, todoId: number) => {
		if (!favorites.value[userId]) {
			favorites.value[userId] = [];
		}

		const isFavorite = favorites.value[userId].includes(todoId);
		favorites.value[userId] = isFavorite
			? favorites.value[userId].filter((id) => id !== todoId)
			: [...favorites.value[userId], todoId];

		localStorage.setItem('favorites', JSON.stringify(favorites.value));
	};

	const loadFavorites = () => {
		const storedFavorites = localStorage.getItem('favorites');
		if (storedFavorites) {
			favorites.value = JSON.parse(storedFavorites);
		}
	};

	const getUserFavorites = (userId: number): number[] =>
		favorites.value[userId] || [];

	const filteredTodos = computed(() =>
		todos.value.filter((todo) => {
			const statusConditions: Record<TodoStatus, (todo: Todo) => boolean> = {
				[TodoStatus.All]: () => true,
				[TodoStatus.Completed]: (todo) => todo.completed,
				[TodoStatus.Uncompleted]: (todo) => !todo.completed,
				[TodoStatus.Favorites]: (todo) => {
					const user = useUserStore().user;
					return user ? favorites.value[user.id]?.includes(todo.id) : false;
				},
			};

			const matchesStatus = statusConditions[filters.status](todo);
			const matchesFilter = filters.search
				? todo.title.toLowerCase().includes(filters.search.toLowerCase())
				: true;
			const matchesId =
				filters.id !== 'All users' ? todo.userId === filters.id : true;

			return matchesStatus && matchesFilter && matchesId;
		})
	);

	return {
		todos,
		favorites,
		filters,
		loading,
		filteredTodos,
		addTodo,
		fetchTodos,
		toggleFavorite,
		loadFavorites,
		getUserFavorites,
	};
});
