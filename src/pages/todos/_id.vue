<template>
  <h1>To-Do Page</h1>
  <todo-form :edeiting="true" />
</template>

<script>
import TodoForm from "@/components/TodoForm.vue";

export default {
  components: {
    TodoForm,
  },
  setup() {},
};
</script>

<style></style>
