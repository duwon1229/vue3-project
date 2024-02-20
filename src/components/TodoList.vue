<template>
  <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
    <div
      class="card-body p-2 d-flex align-items-center"
      @click="moveToPage(todo.id)"
    >
      <div class="form-check flex-grow-1">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(index)"
        />
        <!-- 스타일 바인딩 (label 태그 안에)
            :style="todo.completed && todoStyle" -->
        <label class="form-check-label" :class="{ todo: todo.completed }">{{
          todo.subject
        }}</label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(index)">
          delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  //   props: ["todos"],
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();

    const toggleTodo = (index) => {
      emit("toggle-todo", index);
    };

    const deleteTodo = (index) => {
      emit("delete-todo", index);
    };

    const moveToPage = (todoId) => {
      // router.push("/todos/" + todoId);
      router.push({
        name: "Todo",
        params: {
          id: todoId,
        },
      });
    };

    return {
      toggleTodo,
      deleteTodo,
      moveToPage,
    };
  },
};
</script>

<style></style>
