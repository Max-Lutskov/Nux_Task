<script lang="ts" setup>
  import { useRouter } from "#vue-router";
  import { storeToRefs } from "pinia";
  import { useUserStore } from "~/store/user";

  //Antonette
  //010-692-6593 x09125

  const name = ref<string>('');
  const phone = ref<string>('');

  const router = useRouter();
  const userStore = useUserStore();
  const { error } = storeToRefs(useUserStore());

  onMounted(() => {
    if (userStore.user) {
      router.push('/');
    }
  });

  onBeforeMount(() => {
    userStore.initializeUser();
  });

  watchEffect(() => {
    if (name.value || phone.value) {
      error.value = ''
    }
  })
</script>

<template>
  <div class="form">
    <div class="form__box">
      <div class="form__header">
        <h4>Login form</h4>
      </div>

      <form @submit.prevent="userStore.login(name, phone)" class="form__wrapper">
        <h3>description</h3>

        <input id="username" v-model="name" placeholder="Username" type="text" pattern="[A-Za-z]+" required class="form__input " />

        <input id="phone" v-model="phone" placeholder="Phone Number" type="text" required class="form__input" />

        <span style="color: red" class="form__input-error">{{ error }}</span>

        <button type="submit" class="form__button">Register</button>
      </form>
    </div>
  </div>
</template>

