<template>
  <div class="flex w-full items-center justify-center">
    <label
      for="dropzone-file"
      class="hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600"
    >
      <div class="flex flex-col items-center justify-center pb-6 pt-5">
        <Icon name="humbleicons:upload" color="#9ca3af" size="46" />
        <p class="mb-2 text-sm text-gray-400">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs text-gray-400">
          MP3, MP4, WAV, AAC or OGG (MAX. 100MB)
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        ref="fileInput"
        class="ml-12 text-gray-400 file:hidden"
      />
    </label>
  </div>
</template>
