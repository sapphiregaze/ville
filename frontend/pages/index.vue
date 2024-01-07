<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-[linear-gradient(to_bottom,rgba(17,16,29,1),rgba(8,51,68,0.85)),url('/background.jpg')] bg-cover bg-fixed bg-center bg-no-repeat p-12"
  >
    <div class="absolute right-0 top-0 m-2 flex p-2">
      <NuxtLink to="/login">
        <div
          class="text-bold m-2 rounded-xl px-4 py-2 text-xl text-teal-200 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
        >
          Login
        </div>
      </NuxtLink>
      <NuxtLink to="/register">
        <div
          class="text-bold m-2 rounded-xl px-4 py-2 text-xl text-teal-200 shadow-lg hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
        >
          Register
        </div>
      </NuxtLink>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="-mt-20 flex text-left text-5xl font-extrabold">
        <span
          class="relative mx-4 h-[1em] w-72 overflow-hidden leading-none text-emerald-700"
        >
          <span
            class="absolute h-full w-full -translate-y-full animate-slide text-right"
          >
            Fast&nbsp;
          </span>
          <span
            class="absolute h-full w-full -translate-y-full animate-slide text-right [animation-delay:0.83s]"
          >
            Free&nbsp;
          </span>
          <span
            class="absolute h-full w-full -translate-y-full animate-slide text-right [animation-delay:1.83s]"
          >
            Unlimited&nbsp;
          </span>
        </span>
        <div
          class="bg-gradient-to-tl from-emerald-800 to-teal-200 bg-clip-text text-transparent"
        >
          Music Streaming
        </div>
      </div>
      <NuxtLink to="/library" class="relative m-6">
        <div
          class="absolute -inset-1 rounded-lg bg-gradient-to-r from-emerald-700 via-green-400 to-teal-200 opacity-75 blur"
        ></div>
        <button
          class="relative rounded-lg bg-[#11101d] px-8 py-4 text-xl text-teal-300 hover:animate-pulse hover:text-2xl hover:font-extrabold hover:text-teal-200"
        >
          Explore
        </button>
      </NuxtLink>
    </div>
  </div>
</template>
