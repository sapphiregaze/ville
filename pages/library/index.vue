<template>
  <div
    class="align-center flex flex-col bg-gradient-to-br from-emerald-600 to-teal-200 bg-clip-text px-64 py-8 text-transparent"
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
      v-for="track in tracks"
      class="flex rounded-lg p-2 hover:bg-black hover:text-white"
    >
      <div class="w-20 pr-12 text-right">{{ track.id }}</div>
      <div class="w-96 pr-32 text-left">{{ track.title }}</div>
      <div class="w-24 text-right">{{ track.duration }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const tracks: ref = ref([]);
console.log(process.env.BACKEND_HOST);

onMounted(async () => {
  await fetchTracks();
});

async function fetchTracks() {
  try {
    const response: any = await fetch(`http://localhost:8080/api/tracks/`);
    const data: json = await response.json();
    parseDuration(data);
    tracks.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function parseDuration(data) {
  data.forEach((data) => {
    const seconds: String =
      data.duration % 60 >= 10
        ? String(data.duration % 60)
        : "0" + String(data.duration % 60);
    const minutes: String = String(Math.floor(data.duration / 60));
    data.duration = minutes + ":" + seconds;
  });
}
</script>
