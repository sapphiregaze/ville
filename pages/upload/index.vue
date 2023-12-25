<template>
  <div class="flex h-screen w-screen items-center justify-center p-12">
    <form @submit.prevent="upload" class="flex min-w-96 flex-col">
      <Dropzone ref="dropzone" />
      <button
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
  methods: {
    async upload() {
      const dropzoneComponent = this.$refs.dropzone;
      const fileInput = dropzoneComponent.$refs.fileInput;

      const formData = new FormData();
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
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
    },
  },
};
</script>
