export default {
  namespaced: true,
  state: {
    toasts: [],
    // showToast: false,
    // toastMsg: "",
    // toastAlertType: "",
  },
  mutations: {
    // UPDATE_TOAST_MESSAGE(state, payload) {
    //   state.toastMsg = payload;
    // },
    // UPDATE_TOAST_ALERT_TYPE(state, payload) {
    //   state.toastAlertType = payload;
    // },
    // UPDATE_TOAST_STATUS(state, payload) {
    //   state.showToast = payload;
    // },
    ADD_TOAST(state, payload) {
      state.toasts.push(payload);
    },
    REMOVE_TOAST(state) {
      state.toasts.shift();
    },
  },
  actions: {
    triggerToast({ commit }, payload) {
      // commit("UPDATE_TOAST_MESSAGE", message);
      // commit("UPDATE_TOAST_ALERT_TYPE", type);
      // commit("UPDATE_TOAST_STATUS", true);
      commit("ADD_TOAST", {
        id: Date.now(),
        message: payload.message,
        type: payload.type,
      });

      setTimeout(() => {
        // commit("UPDATE_TOAST_MESSAGE", "");
        // commit("UPDATE_TOAST_ALERT_TYPE", "");
        // commit("UPDATE_TOAST_STATUS", false);
        commit("REMOVE_TOAST");
      }, 10000);
    },
  },
  getters: {
    toastMsgWithSmile(state) {
      return state.toastMsg + "^_^";
    },
  },
};
