<template>
  <navbar />
  <div class="container">
    <RouterView />
  </div>
  <toast />
</template>

<script>
import Toast from "@/components/Toast.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Toast,
    Navbar,
  },
};
</script>

<style></style>
