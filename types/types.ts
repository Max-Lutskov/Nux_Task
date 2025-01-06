export interface User {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
}

export interface Todo {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

export enum TodoStatus {
	All = 'All',
	Completed = 'Completed',
	Uncompleted = 'Uncompleted',
	Favorites = 'Favorites',
}

