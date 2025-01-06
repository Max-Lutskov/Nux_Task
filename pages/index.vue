<script lang="ts" setup>
import CreateForm from "~/components/CreateForm.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from 'vue';
import { useTodoStore } from "~/store/todos";
import { useUserStore } from "~/store/user";
import { TodoStatus, type User } from "~/types/types";

const userStore = useUserStore();
const todoStore = useTodoStore();

const user = userStore.user;
const { filteredTodos, filters, loading } = storeToRefs(todoStore);

const users = await $fetch<Array<User>>(`${ useRuntimeConfig().public.apiBase }/users`)

const page = ref(1);
const itemsPerPage = 5;

const paginatedTodos = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredTodos.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredTodos.value.length / itemsPerPage));

onBeforeMount(async () => {
  await todoStore.fetchTodos();
});
</script>

<template>
  <div v-if="loading">loading...</div>
  <div v-else-if="user && !loading" class="todos">
    <header class="todos__header">
      <h1 class="todos__title">Todo List</h1>
      <button @click="userStore.logout" class="todos__logout">Logout</button>
    </header>

    <div class="todos__info">
      <h2>Current Account Info</h2>
      <p>Name: {{user.name}}</p>
      <p>Email: {{user.email}}</p>
      <p>Number: {{user.phone}}</p>
    </div>

    <CreateForm :users="users" />

    <section class="todos__section">
      <div class="todos__filters">
        <select v-model="filters.status" class="todos__select">
          <option disabled selected>Status</option>
          <option v-for="filter in Object.values(TodoStatus)" :value="filter">{{ filter }}</option>
        </select> <select v-model="filters.id" class="todos__select">
        <option disabled selected>User Id</option>
        <option value="All users">All Users</option>
        <option v-for="user in users" :value="user.id"> {{ user.name }}</option>
      </select> <input v-model="filters.search" class="todos__input" placeholder="Search by title"/>
      </div>

      <template v-if="paginatedTodos.length > 0">
        <ul class="todos__list">
          <li v-for="todo in paginatedTodos" :key="todo.id" class="todos__item-wrapper">
            <div class="todos__item">
              <h2 class="todos__item-title">{{ todo.title }}</h2>
              <button class="todos__favorite-button" @click="todoStore.toggleFavorite(user.id, todo.id)">
                <Icon size="20" :class="todoStore.getUserFavorites(user.id).includes(todo.id) ? 'todos__favorite' : 'todos__not-favorite'" name="mdi-star" />
              </button>
            </div>
            <p class="todos__item-status">Status: {{ todo.completed ? 'Completed' : 'Uncompleted' }}</p>
          </li>
        </ul>
      </template>
      <template v-else>
        No result for filters
      </template>

      <div class="todos__pagination">
        <button :disabled="page <= 1" class="todos__pagination-button" @click="page--">
          Previous
        </button>
        <span class="todos__pagination-info">Page {{ page }} of {{ totalPages }}</span>
        <button :disabled="page >= totalPages" class="todos__pagination-button" @click="page++">
          Next
        </button>
      </div>
    </section>
  </div>
</template>
