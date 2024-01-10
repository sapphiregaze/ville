<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Notification
      :hidden="hidden"
      :status="status"
      :message="message"
      @hidden="setHidden(true)"
    />
    <div
      class="rounded-lg border border-[#131516] bg-[#11101d] bg-opacity-50 bg-clip-padding p-8 backdrop-blur-md backdrop-filter"
    >
      <form
        @submit.prevent="register"
        class="flex flex-col items-center justify-center bg-gradient-to-tl from-emerald-100 to-teal-400 bg-clip-text text-transparent"
      >
        <div class="text-2xl font-semibold">Register Account</div>
        <div class="relative mx-4 mt-4 h-10 w-full min-w-24">
          <input
            v-model="email"
            placeholder="Email"
            class="peer h-full w-full rounded-sm bg-transparent px-3 py-2.5 text-sm font-normal text-teal-200 outline outline-0 transition-all placeholder:opacity-0 focus:outline-0 focus:placeholder:opacity-100"
          />
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-gray-400 transition-all before:pointer-events-none before:mr-1 before:mt-2 before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:transition-all after:pointer-events-none after:ml-1 after:mt-2 after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-sm peer-focus:leading-tight peer-focus:text-teal-200"
          >
            Email
          </label>
        </div>
        <div class="relative mx-4 mt-4 h-10 w-full min-w-24">
          <input
            v-model="username"
            placeholder="Username"
            class="peer h-full w-full rounded-sm bg-transparent px-3 py-2.5 text-sm font-normal text-teal-200 outline outline-0 transition-all placeholder:opacity-0 focus:outline-0 focus:placeholder:opacity-100"
          />
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-gray-400 transition-all before:pointer-events-none before:mr-1 before:mt-2 before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:transition-all after:pointer-events-none after:ml-1 after:mt-2 after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-sm peer-focus:leading-tight peer-focus:text-teal-200"
          >
            Username
          </label>
        </div>
        <div class="relative mx-4 mt-4 h-10 w-full min-w-24">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="peer h-full w-full rounded-sm bg-transparent px-3 py-2.5 text-sm font-normal text-teal-200 outline outline-0 transition-all placeholder:opacity-0 focus:outline-0 focus:placeholder:opacity-100"
          />
          <label
            class="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-gray-400 transition-all before:pointer-events-none before:mr-1 before:mt-2 before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:transition-all after:pointer-events-none after:ml-1 after:mt-2 after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-sm peer-focus:leading-tight peer-focus:text-teal-200"
          >
            Password
          </label>
        </div>
        <button
          @click="setHidden(false)"
          type="submit"
          class="mx-8 my-4 rounded-xl px-6 py-2 hover:animate-pulse hover:bg-[#131516] hover:font-extrabold hover:text-emerald-400 hover:outline-double"
        >
          Register
        </button>
        <div>Or</div>
        <NuxtLink to="/login">
          <div class="hover:animate-bounce hover:font-extrabold">Login</div>
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "clean",
});
</script>

<script>
export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      status: null,
      hidden: true,
      message: "",
    };
  },
  methods: {
    setHidden(state) {
      this.hidden = state;
    },
    async register() {
      const user = {
        email: this.email,
        username: this.username,
        password: this.password,
      };

      try {
        const response = await fetch(
          `${this.$config.public.host}/api/user/register/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Successfully logged in!");
          localStorage.setItem("token", data.token);

          this.status = true;
          this.message = "Login Successful!";

          this.$router.push("/library");
        } else {
          console.log(data.error);
          this.status = false;
          this.message = data.error;
        }
      } catch (error) {
        console.error("Network connection error: ", error);
        this.status = false;
        this.message = "Network connection error.";
      }
    },
  },
};
</script>
