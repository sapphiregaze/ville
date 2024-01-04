<template>
  <div
    class="align-center mb-56 ml-16 flex flex-col bg-gradient-to-br from-emerald-600 to-teal-200 bg-clip-text px-64 py-8 text-transparent"
  >
    <div class="ml-4 pb-4 pt-8 text-5xl font-extrabold">Library</div>
    <div class="flex p-2 text-2xl font-extrabold">
      <div class="w-20 pr-12 text-right">#</div>
      <div class="w-96 pr-32">Title</div>
      <Icon
        name="material-symbols:alarm-rounded"
        color="#059669"
        size="28"
        class="w-36"
      />
    </div>
    <div
      @mouseover="togglePlaying(true), setCurrentId(index)"
      @mouseout="togglePlaying(false), setCurrentId(null)"
      v-for="(track, index) in tracks"
      :key="index"
      class="flex rounded-lg p-2 hover:bg-[#11101d] hover:text-slate-300"
    >
      <div class="flex">
        <button
          v-if="playing && selectedId === index"
          @click="setAudioId(index)"
        >
          <Icon
            name="material-symbols:play-arrow-rounded"
            color="#059669"
            size="24"
            class="ml-2 w-20 pr-12 text-right hover:animate-pulse"
          />
        </button>

        <div v-else class="w-20 pr-12 text-right">
          {{ index + 1 }}
        </div>
        <div class="w-96 pr-32 text-left">{{ track.title }}</div>
        <div class="w-24 text-right">{{ track.duration }}</div>
      </div>
    </div>
    <AudioPlayer :tracks="tracks" :id="audioId" />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      tracks: [],
      selectedId: null,
      playing: false,
      audioId: -1,
    };
  },
  mounted() {
    const token = localStorage.getItem("token");

    fetch(`${this.$config.public.host}/api/tracks/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((tracks) => {
        tracks.forEach((track) => {
          const seconds =
            track.duration % 60 >= 10
              ? String(track.duration % 60)
              : "0" + String(track.duration % 60);
          const minutes = String(Math.floor(track.duration / 60));
          track.duration = minutes + ":" + seconds;
        });

        this.tracks = tracks;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },
  methods: {
    setCurrentId(id) {
      this.selectedId = id;
    },
    togglePlaying(state) {
      this.playing = state;
    },
    setAudioId(id) {
      this.audioId = id;
    },
  },
};
</script>
