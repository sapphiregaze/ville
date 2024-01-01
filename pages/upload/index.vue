<template>
  <div class="ml-16 flex h-screen w-screen items-center justify-center p-12">
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
    <div
      class="flex h-full w-full flex-col divide-y-4 divide-dashed divide-teal-400"
    >
      <form
        @submit.prevent="uploadUrl"
        class="flex min-w-96 flex-col justify-center"
      >
        <div class="px-20 py-6 text-center text-2xl text-emerald-400">
          Upload via YouTube URL:
        </div>
        <div
          class="focus mx-8 rounded-full from-emerald-700 via-green-400 to-teal-200 p-1 focus-within:bg-gradient-to-r hover:bg-gradient-to-r"
        >
          <input
            v-model="youtubeUrl"
            class="w-full rounded-full border border-green-400 p-3 hover:border-transparent focus:border-transparent focus:outline-none"
            type="text"
            id="youtube"
            placeholder="Enter YouTube URL"
          />
        </div>
        <div class="flex w-full items-center justify-center">
          <button
            @click="setHidden(false)"
            type="submit"
            class="mx-8 my-4 rounded-xl bg-gradient-to-tl from-emerald-100 to-teal-400 bg-clip-text px-6 py-2 text-transparent hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="humbleicons:upload" color="#059669" size="24" />
            Upload
          </button>
        </div>
      </form>
      <form
        @submit.prevent="upload"
        class="flex min-w-96 flex-col justify-center p-4"
      >
        <div class="px-12 py-6 text-center text-2xl text-emerald-400">
          Upload via audio files:
        </div>
        <Dropzone ref="dropzone" />
        <div class="flex w-full items-center justify-center">
          <button
            @click="setHidden(false)"
            type="submit"
            class="mx-8 my-4 rounded-xl bg-gradient-to-tl from-emerald-100 to-teal-400 bg-clip-text px-6 py-2 text-transparent hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="humbleicons:upload" color="#059669" size="24" />
            Upload
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      youtubeUrl: "",
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
          `${this.$config.public.host}/api/tracks/upload/`,
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
    async uploadUrl() {
      const url = this.youtubeUrl;

      try {
        const response = await fetch(
          `${this.$config.public.host}/api/tracks/uploadUrl/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
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
