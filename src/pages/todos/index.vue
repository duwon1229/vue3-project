<template>
  <RouterView />
  <div class="container">
    <h2>To-Do List</h2>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />
    <TodoSimpleForm @add-todo="addTodo" />
    <div style="color: red">
      {{ error }}
    </div>
    <div v-if="!todos.length">There is nothing to display</div>
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <TodoPagenation
      :numberOfTodos="numberOfTodos"
      :limit="limit"
      @get-todo="getTodos"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import TodoList from "@/components/TodoList.vue";
import TodoPagenation from "@/components/TodoPagenation.vue";
import axios from "axios";

export default {
  components: {
    TodoSimpleForm,
    TodoList,
    TodoPagenation,
  },
  setup() {
    const todos = ref([]);
    const searchText = ref("");
    // const filteredTodos = computed(() => {
    //   if (searchText.value) {
    //     return todos.value.filter((todo) =>
    //       todo.subject.includes(searchText.value),
    //     );
    //   }
    //   return todos.value;
    // });
    const error = ref("");
    const numberOfTodos = ref(0);
    const limit = 5;
    const todoStyle = {
      textDecoration: "line-through",
      color: "gray",
    };

    const getTodos = async (page) => {
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_order=desc&_page=${page}&_limit=${limit}&subject_like=${searchText.value}`,
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        error.value = "Something went wrong.";
      }
    };

    getTodos();

    let timeout = null;
    const searchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    };

    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);
    });

    const addTodo = async (todo) => {
      error.value = "";
      try {
        await axios.post("http://localhost:3000/todos", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
      } catch {
        error.value = "Something went wrong.";
      }
    };

    const toggleTodo = async (index) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.patch("http://localhost:3000/todos/" + id, {
          completed: !todos.value[index].completed,
        });
        todos.value[index].completed = !todos.value[index].completed;
      } catch {
        error.value = "Something went wrong.";
      }
    };

    const deleteTodo = async (index) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.delete("http://localhost:3000/todos/" + id);
        getTodos();
      } catch {
        error.value = "Something went wrong.";
      }
    };

    return {
      todos,
      searchText,
      // filteredTodos,
      error,
      numberOfTodos,
      limit,
      todoStyle,
      searchTodo,
      addTodo,
      getTodos,
      toggleTodo,
      deleteTodo,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
