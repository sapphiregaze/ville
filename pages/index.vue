<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-gradient-to-tl from-emerald-800 to-teal-200 bg-clip-text p-12 text-transparent"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="-mt-20 text-5xl font-extrabold">Welcome to ville</div>
      <NuxtLink to="/library" class="relative m-6">
        <div
          class="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-700 via-green-400 to-teal-200 opacity-75 blur"
        ></div>
        <button
          class="relative rounded-lg bg-[#11101d] px-7 py-4 text-xl text-teal-300 hover:animate-pulse hover:text-2xl hover:font-extrabold hover:text-teal-200"
        >
          Explore
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
