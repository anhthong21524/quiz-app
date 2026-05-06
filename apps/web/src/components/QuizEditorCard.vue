<template>
  <div class="flex h-full flex-col rounded-[20px] border border-[rgba(226,223,218,0.92)] bg-white p-3 shadow-[0_10px_26px_rgba(46,35,20,0.06)] sm:p-4">
    <div class="flex-1 space-y-3">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="flex flex-col gap-3 border-t border-gray-100 pt-4 md:flex-row md:items-center md:justify-between"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
