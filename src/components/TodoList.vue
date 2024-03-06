<template>
  <!-- <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2"> -->
  <List :items="todos">
    <template #default="{ item, index }">
      <div
        class="card-body p-2 d-flex align-items-center"
        style="cursor: pointer"
        @click="moveToPage(item.id)"
      >
        <div class="flex-grow-1">
          <input
            type="checkbox"
            class="ml-2 mr-2"
            :checked="item.completed"
            @change="toggleTodo(index, $event)"
            @click.stop
          />
          <!-- 스타일 바인딩 (label 태그 안에)
            :style="todo.completed && todoStyle" -->
          <span :class="{ todo: item.completed }">{{ item.subject }}</span>
        </div>
        <div>
          <button
            class="btn btn-danger btn-sm"
            @click.stop="openModal(item.id)"
          >
            delete
          </button>
        </div>
      </div>
    </template>
  </List>
  <!-- </div> -->
  <teleport to="#modal">
    <modal v-if="showModal" @close="closeModal" @delete="deleteTodo" />
  </teleport>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "@/components/DeleteModal.vue";
import List from "@/components/list.vue";

export default {
  components: {
    Modal,
    List,
  },
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
    const showModal = ref(false);
    const todoDeleteId = ref(null);

    const openModal = (id) => {
      todoDeleteId.value = id;
      showModal.value = true;
    };

    const closeModal = () => {
      todoDeleteId.value = null;
      showModal.value = false;
    };

    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked);
    };

    const deleteTodo = () => {
      emit("delete-todo", todoDeleteId.value);
      showModal.value = false;
      todoDeleteId.value = null;
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
      showModal,
      openModal,
      closeModal,
      toggleTodo,
      deleteTodo,
      moveToPage,
    };
  },
};
</script>

<style></style>
