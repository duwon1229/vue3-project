<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="currentPage !== 1" class="page-item">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage - 1)"
          >Previous</a
        >
      </li>
      <li
        v-for="page in numberOfPages"
        :key="page"
        :class="currentPage === page && 'active'"
        class="page-item"
      >
        <a style="cursor: pointer" class="page-link" @click="getTodos(page)">{{
          page
        }}</a>
      </li>
      <li v-if="numberOfPages !== currentPage" class="page-item">
        <a
          style="cursor: pointer"
          class="page-link"
          @click="getTodos(currentPage + 1)"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref, computed } from "vue";

export default {
  props: ["numberOfTodos", "limit"],
  emits: ["get-todo"],
  setup(props, { emit }) {
    const currentPage = ref(1);
    const numberOfPages = computed(() =>
      Math.ceil(props.numberOfTodos / props.limit),
    );

    const getTodos = (page = currentPage.value) => {
      currentPage.value = page;
      emit("get-todo", page);
    };

    return {
      currentPage,
      numberOfPages,
      getTodos,
    };
  },
};
</script>

<style></style>
