<template>
  <div class="fixed bottom-0 left-1/2 w-full -translate-x-1/2 transform">
    <audio
      ref="audioPlayer"
      controls
      :src="audioSrc"
      @timeupdate="onPlaying"
      class="hidden"
    ></audio>
    <div class="flex items-center justify-center pl-20">
      <div class="w-full rounded-lg bg-[#11101d] shadow-lg">
        <div class="flex">
          <div class="w-full px-8 pt-4">
            <div class="flex items-center justify-center">
              <h3
                class="bg-gradient-to-br from-emerald-800 to-teal-200 bg-clip-text pb-2 text-4xl font-extrabold text-transparent"
              >
                {{ audioName }}
              </h3>
            </div>
            <div class="mx-4">
              <div
                class="text-md flex justify-between font-bold text-emerald-600"
              >
                <p class="px-4">
                  {{ parseDuration(parseInt(currentTime, 10)) }}
                </p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  v-model="seekValue"
                  @change="onSeek"
                  class="h-5 w-full appearance-none rounded-lg bg-gray-800"
                />
                <p class="px-4">{{ audioDuration }}</p>
              </div>
            </div>
            <div
              class="flex items-center justify-between bg-gradient-to-br from-emerald-800 to-teal-200 bg-clip-text px-56 pb-2 text-transparent"
            >
              <div
                class="text-xl font-extrabold hover:font-extrabold hover:text-emerald-500"
              >
                <button @click="setSpeed(1)">1x</button>
              </div>
              <button @click="changeAudioId(-1)">
                <Icon
                  name="material-symbols:skip-previous-rounded"
                  color="#059669"
                  size="46"
                  class="hover:animate-pulse"
                />
              </button>
              <div
                class="rounded-full p-4 shadow-lg hover:animate-pulse hover:shadow-2xl"
              >
                <button
                  @click="
                    playOrPause();
                    togglePlaying();
                  "
                >
                  <Icon
                    v-if="!playing"
                    name="material-symbols:play-arrow-rounded"
                    color="#059669"
                    size="46"
                  />
                  <Icon
                    v-else
                    name="material-symbols:pause-rounded"
                    color="#059669"
                    size="46"
                  />
                </button>
              </div>
              <button @click="changeAudioId(1)">
                <Icon
                  name="material-symbols:skip-next-rounded"
                  color="#059669"
                  size="46"
                  class="hover:animate-pulse"
                />
              </button>
              <div
                class="text-xl font-normal hover:font-extrabold hover:text-emerald-500"
              >
                <button @click="setSpeed(2)">2x</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tracks: Array,
    id: Number,
    name: String,
    duration: String,
  },
  data() {
    return {
      audioSrc: `${this.$config.public.host}/api/audio/${this.id}`,
      audioId: this.id,
      audioName: this.name,
      audioDuration: this.duration,
      playing: false,
      currentTime: 0,
      seekValue: 0,
    };
  },
  methods: {
    playOrPause() {
      if (!this.playing) this.$refs.audioPlayer.play();
      else this.$refs.audioPlayer.pause();
    },
    setSpeed(speed) {
      this.$refs.audioPlayer.playbackRate = speed;
    },
    onPlaying() {
      const { audioPlayer } = this.$refs;
      if (!audioPlayer) {
        return;
      }
      this.currentTime = audioPlayer.currentTime;
      this.seekValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    },
    onSeek() {
      const { audioPlayer } = this.$refs;
      const seekto = audioPlayer.duration * (this.seekValue / 100);
      audioPlayer.currentTime = seekto;
    },
    togglePlaying() {
      this.playing = !this.playing;
    },
    changeAudioId(amount) {
      // check for edge cases to ensure id stays between 1 and tracks.length
      if (this.audioId <= 1 && amount < 0) {
        this.audioId = this.tracks.length + (0 - amount);
      }
      if (this.audioId >= this.tracks.length && amount > 0) {
        this.audioId = this.audioId % this.tracks.length;
      }
      this.audioId += amount;

      // reset data corresponding to the audio id
      this.audioSrc = `${this.$config.public.host}/api/audio/${this.audioId}`;
      this.audioName = this.tracks[this.audioId - 1].title;
      this.audioDuration = this.tracks[this.audioId - 1].duration;
    },
    parseDuration(time) {
      const seconds =
        time % 60 >= 10 ? String(time % 60) : "0" + String(time % 60);
      const minutes = String(Math.floor(time / 60));
      return minutes + ":" + seconds;
    },
  },
  watch: {
    id: function (newId) {
      this.audioSrc = `${this.$config.public.host}/api/audio/${newId}`;
      this.audioId = newId;
      this.playing = false;
      this.seekValue = 0;
      this.currentTime = 0;
      this.$refs.audioPlayer.currentTime = 0;
    },
    name: function (newName) {
      this.audioName = newName;
    },
    duration: function (newDuration) {
      this.audioDuration = newDuration;
    },
    audioId: function () {
      this.playing = false;
      this.seekValue = 0;
      this.currentTime = 0;
      this.$refs.audioPlayer.currentTime = 0;
    },
  },
};
</script>
