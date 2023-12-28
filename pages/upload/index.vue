<template>
  <div class="flex h-screen w-screen items-center justify-center p-12">
    <div v-if="!hidden" class="absolute right-0 top-0 m-4 animate-pulse">
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
        <span v-if="uploadStatus" class="block text-slate-300"
          >File uploaded successfully!</span
        >
        <span v-else class="block text-slate-300">Failed to upload file.</span>
      </div>
    </div>
    <form @submit.prevent="upload" class="flex min-w-96 flex-col">
      <Dropzone ref="dropzone" />
      <button
        @click="setHidden(false)"
        type="submit"
        class="m-2 rounded-xl bg-gradient-to-tl from-emerald-100 to-teal-400 bg-clip-text p-2 text-transparent hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
      >
        <Icon name="humbleicons:upload" color="#059669" size="24" />
        Upload
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadStatus: null,
      hidden: true,
    };
  },
  methods: {
    setHidden(state) {
      this.hidden = state;
    },
    async upload() {
      const formData = new FormData();
      const fileInput = this.$refs.dropzone.$refs.fileInput;

      formData.append("audio", fileInput.files[0]);

      try {
        const response = await fetch(
          "http://localhost:8080/api/tracks/upload/",
          {
            method: "POST",
            body: formData,
          },
        );

        if (response.ok) {
          console.log("File uploaded successfully");
          this.uploadStatus = true;
        } else {
          console.error("Error uploading file: ", error);
          this.uploadStatus = false;
        }
      } catch (error) {
        console.error("Network connection error: ", error);
        this.uploadStatus = false;
      }
    },
  },
};
</script>
