<script>
export default {
  data() {
    return {
      sidebarCollapsed: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
  },
};
</script>

<template>
  <div
    class="sticky flex h-full w-72 justify-center bg-[#11101d] outline outline-[#131516]"
  >
    <div
      class="mt-12 bg-gradient-to-br from-emerald-800 to-teal-200 bg-clip-text p-8 font-mono text-transparent"
    >
      <div class="text-5xl font-semibold hover:animate-pulse">ville</div>
      <div class="-ml-4 mt-12 text-xl">
        <NuxtLink to="/">
          <div
            class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="humbleicons:home" color="#059669" size="24" />
            Home
          </div>
        </NuxtLink>
        <NuxtLink to="/library">
          <div
            class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="humbleicons:music-note" color="#059669" size="24" />
            Library
          </div>
        </NuxtLink>
        <NuxtLink to="/upload">
          <div
            class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="humbleicons:upload" color="#059669" size="24" />
            Upload
          </div>
        </NuxtLink>
        <NuxtLink to="/settings">
          <div
            class="mt-80 rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
          >
            <Icon name="healthicons:ui-settings" color="#059669" size="24" />
            Settings
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
