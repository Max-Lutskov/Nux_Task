<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useTodoStore } from '~/store/todos';
import { type User } from '~/types/types';

const props = defineProps<{ users: User[] }>();
const emit = defineEmits(['todoAdded']);

const todoStore = useTodoStore();


const newTodoUserId = ref<number | undefined>();
const newTodoTitle = ref('');


const isSubmitDisabled = computed(() => {
  return !newTodoUserId.value || !newTodoTitle.value.trim();
});

const onSubmit = () => {
  if (newTodoUserId.value) {
    todoStore.addTodo(newTodoUserId.value, newTodoTitle.value);
    newTodoUserId.value = undefined;
    newTodoTitle.value = '';
    emit('todoAdded');
  }
};


</script>

<template>
  <section class="todos__create">
    <h2 class="todos__section-title">Add New Task</h2>
    <form @submit.prevent="onSubmit" class="todos__form">
      <select v-model.number="newTodoUserId" class="todos__input todos__input--large" required>
        <option disabled selected>Select User ID</option>
        <option v-for="user in props.users" :key="user.id" :value="user.id">{{ user.name }}</option>
      </select>
      <input v-model="newTodoTitle" class="todos__input todos__input--large" placeholder="Title" required />
      <button :disabled="isSubmitDisabled" class="todos__submit" type="submit">
        Add Task
      </button>
    </form>
  </section>
</template>

