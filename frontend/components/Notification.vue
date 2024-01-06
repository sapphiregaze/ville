<template>
  <div v-if="!isHidden" class="absolute right-0 top-0 m-4 animate-pulse">
    <div
      :class="[
        'relative',
        'flex',
        'items-center',
        'justify-between',
        'rounded-t',
        { 'bg-green-700': uploadStatus, 'bg-red-700': !uploadStatus },
        'px-2',
        'py-2',
        'font-bold',
        'text-slate-300',
      ]"
    >
      <div class="relative flex items-center">
        <Icon
          v-if="uploadStatus"
          name="material-symbols:check-circle-outline"
          color="#cbd5e1"
          size="22"
          class="mx-2"
        />
        <Icon
          v-else
          name="solar:shield-cross-bold"
          color="#cbd5e1"
          size="22"
          class="mx-2"
        />
        <span v-if="uploadStatus">Success</span>
        <span v-else>Failure</span>
      </div>
      <span @click="setHidden(true)" class="relative">
        <Icon
          name="system-uicons:cross"
          color="#cbd5e1"
          size="22"
          class="mx-2 hover:cursor-pointer"
        />
      </span>
    </div>
    <div class="rounded-b border border-gray-700 bg-teal-950 p-3 shadow-lg">
      <span v-if="uploadStatus" class="block text-slate-300">{{
        notifMessage
      }}</span>
      <span v-else class="block text-slate-300">{{ notifMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: Boolean,
    hidden: Boolean,
    message: String,
  },
  data() {
    return {
      uploadStatus: this.status,
      isHidden: this.hidden,
      notifMessage: this.message,
    };
  },
  methods: {
    setHidden(state) {
      this.$emit("hidden", true);
    },
  },
  watch: {
    status: function (newStatus) {
      this.uploadStatus = newStatus;
    },
    hidden: function (newHidden) {
      this.isHidden = newHidden;
    },
    message: function (newMessage) {
      this.notifMessage = newMessage;
    },
  },
};
</script>
