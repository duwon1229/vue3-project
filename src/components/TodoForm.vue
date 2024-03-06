<template>
  <div v-if="loading">Loading</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <Input
          label="Subject"
          v-model:subject="todo.subject"
          :error="subjectError"
        />
      </div>
      <div v-if="edeiting" class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              class="btn"
              type="button"
              @click="toggleTodoStatus"
            >
              {{ todo.completed ? "Completed" : "Incomplete" }}
            </button>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea
            v-model="todo.body"
            class="form-control"
            cols="30"
            rows="10"
          />
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary" :disabled="!todoUpdated">
      {{ edeiting ? "Update" : "Create" }}
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveTodoListPage">
      Cancel
    </button>
  </form>
  <transition name="fade">
    <Toast v-if="showToast" :message="toastMsg" :type="toastAlertType" />
  </transition>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import axios from "@/axios";
import _ from "lodash";
import { useToast } from "@/composables/toast";
import Toast from "@/components/Toast.vue";
import Input from "@/components/input.vue";

export default {
  components: {
    Toast,
    Input,
  },
  props: {
    edeiting: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
      body: "",
    });
    const subjectError = ref("");
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoUpdated = computed(
      () => !_.isEqual(todo.value, originalTodo.value),
    );
    const todoId = route.params.id;
    const { showToast, toastAlertType, toastMsg, triggerToast } = useToast();

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`todos/${todoId}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch {
        loading.value = false;
        triggerToast("Something went wrong", "danger");
      }
    };

    if (props.edeiting) {
      getTodo();
    }

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    const moveTodoListPage = () => {
      router.push({
        name: "Todos",
      });
    };

    const onSave = async () => {
      subjectError.value = "";
      if (!todo.value.subject) {
        subjectError.value = "Subject is Required";
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        };
        if (props.edeiting) {
          res = await axios.put(`todos/${todoId}`, data);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`todos`, data);
          todo.value.subject = "";
          todo.value.body = "";
        }
        triggerToast(`Successfully ${props.edeiting ? "Updated" : "Created"}!`);

        if (!props.edeiting) {
          router.push({
            name: "Todos",
          });
        }
      } catch {
        triggerToast("Something went wrong", "danger");
      }
    };

    return {
      todo,
      todoUpdated,
      loading,
      showToast,
      toastMsg,
      toastAlertType,
      subjectError,
      toggleTodoStatus,
      moveTodoListPage,
      onSave,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
