<template>
  <div>
    <div class="d-flex justify-content-between mb-3 mt-2">
      <h2>To-Do List</h2>
      <button class="btn btn-primary" @click="moveToCreatePage">
        Create Todo
      </button>
    </div>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="searchTodo"
    />
    <hr />
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
      v-if="todos.length"
      :numberOfTodos="numberOfTodos"
      :limit="limit"
      @get-todo="getTodos"
    />
  </div>
  <Toast v-if="showToast" :message="toastMsg" :type="toastAlertType" />
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import TodoList from "@/components/TodoList.vue";
import TodoPagenation from "@/components/TodoPagenation.vue";
import Toast from "@/components/Toast.vue";
import axios from "@/axios";
import { useToast } from "@/composables/toast";

export default {
  components: {
    TodoList,
    TodoPagenation,
    Toast,
  },
  setup() {
    const router = useRouter();
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

    const { toastAlertType, toastMsg, showToast, triggerToast } = useToast();

    const getTodos = async (page) => {
      try {
        const res = await axios.get(
          `todos?_order=desc&_page=${page}&_limit=${limit}&subject_like=${searchText.value}`,
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        error.value = "Something went wrong.";
        triggerToast("Something went wrong", "danger");
      }
    };

    getTodos();

    const moveToCreatePage = () => {
      router.push({
        name: "TodoCreate",
      });
    };

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
        await axios.post("todos", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
      } catch {
        error.value = "Something went wrong.";
        triggerToast("Something went wrong", "danger");
      }
    };

    const toggleTodo = async (index, checked) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.patch("todos/" + id, {
          completed: checked,
        });
        todos.value[index].completed = checked;
      } catch {
        error.value = "Something went wrong.";
        triggerToast("Something went wrong", "danger");
      }
    };

    const deleteTodo = async (id) => {
      error.value = "";
      try {
        await axios.delete("todos/" + id);
        getTodos();
      } catch {
        error.value = "Something went wrong.";
        triggerToast("Something went wrong", "danger");
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
      showToast,
      toastAlertType,
      toastMsg,
      moveToCreatePage,
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
