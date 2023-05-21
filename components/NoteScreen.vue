<script lang="ts" setup></script>

<template>
  <UiDragCol class="flex h-full grow">
    <template #left>
      <EditorScreen />
    </template>

    <template #right>
      <SVGRenderScreen />
    </template>
  </UiDragCol>
</template>

<style scoped></style>
