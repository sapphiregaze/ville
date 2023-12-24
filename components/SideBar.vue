<template>
  <aside
    :class="[
      'fixed',
      'h-full',
      { 'w-20': sidebarCollapsed, 'w-72': !sidebarCollapsed },
      'bg-[#11101d]',
      'outline',
      'outline-[#131516]',
    ]"
  >
    <button
      v-if="!sidebarCollapsed"
      @click="toggleSidebar"
      class="absolute right-0 top-0 px-5 py-4"
    >
      <Icon name="ic:baseline-format-list-bulleted" color="#059669" size="24" />
    </button>
    <button
      v-else
      @click="toggleSidebar"
      class="absolute left-1/2 -translate-x-1/2 transform px-5 py-4"
    >
      <Icon name="ic:baseline-format-list-bulleted" color="#059669" size="24" />
    </button>

    <div class="flex justify-center">
      <div
        v-if="!sidebarCollapsed"
        class="mt-12 bg-gradient-to-br from-emerald-800 to-teal-200 bg-clip-text p-8 font-mono text-transparent"
      >
        <div class="text-5xl font-semibold hover:animate-pulse">ville</div>
        <div class="-ml-4 mt-12 text-xl">
          <NuxtLink to="/">
            <div
              class="m-2 rounded-xl p-2 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:home" color="#059669" size="24" />
              Home
            </div>
          </NuxtLink>
          <NuxtLink to="/library">
            <div
              class="m-2 rounded-xl p-2 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:music-note" color="#059669" size="24" />
              Library
            </div>
          </NuxtLink>
          <NuxtLink to="/upload">
            <div
              class="m-2 rounded-xl p-2 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:upload" color="#059669" size="24" />
              Upload
            </div>
          </NuxtLink>
          <NuxtLink to="/settings">
            <div
              class="mt-72 rounded-xl p-2 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="healthicons:ui-settings" color="#059669" size="24" />
              Settings
            </div>
          </NuxtLink>
        </div>
      </div>

      <div
        v-else
        class="mt-12 bg-gradient-to-br from-emerald-800 to-teal-200 bg-clip-text py-8 font-mono text-transparent"
      >
        <div class="p-2 text-5xl font-semibold hover:animate-pulse">v</div>
        <div class="mt-12 text-xl">
          <NuxtLink to="/">
            <div
              class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:home" color="#059669" size="24" />
            </div>
          </NuxtLink>
          <NuxtLink to="/library">
            <div
              class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:music-note" color="#059669" size="24" />
            </div>
          </NuxtLink>
          <NuxtLink to="/upload">
            <div
              class="rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="humbleicons:upload" color="#059669" size="24" />
            </div>
          </NuxtLink>
          <NuxtLink to="/settings">
            <div
              class="mt-72 rounded-xl p-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
            >
              <Icon name="healthicons:ui-settings" color="#059669" size="24" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      sidebarCollapsed: true,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
  },
};
</script>
