<template>
  <div>
    <audio
      ref="audio"
      controls
      :src="audioSrc"
      class="absolute bottom-0 left-1/2 -translate-x-1/2 transform pl-20"
    ></audio>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
  },
  data() {
    return {
      audioSrc: `http://localhost:8080/api/audio/${this.id}`,
    };
  },
  watch: {
    id: function (newId) {
      this.audioSrc = `http://localhost:8080/api/audio/${newId}`;
    },
  },
};
</script>
