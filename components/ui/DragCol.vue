<template>
  <div ref="container" :class="cn(['drager_col', props.class])">
    <div class="drager_left" :style="{ width: left + '%' }">
      <div class="flex flex-col">
        <slot name="left" />
      </div>
    </div>
    <div
      class="slider_col"
      :style="{
        width: sliderWidth + 'px',
        marginLeft: -sliderWidth / 2 + 'px',
        marginRight: -sliderWidth / 2 + 'px',
      }"
      @touchstart.passive="mobileDragCol"
      @mousedown="dragCol"
    />
    <div class="drager_right" :style="{ width: 100 - left + '%' }">
      <div class="flex flex-col">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// Modified from https://github.com/justcaliturner/vue-resizer/blob/main/src/components/DragCol.vue
// Use TypeScript and setup script instead

const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  minLeft: {
    type: Number,
    default: 20,
  },
  maxLeft: {
    type: Number,
    default: 80,
  },
  leftPercent: {
    type: Number,
    default: 50,
  },
  sliderWidth: {
    type: Number,
    default: 20,
  },
  sliderColor: {
    type: String,
    default: "#6f808d",
  },
  sliderBgColor: {
    type: String,
    default: "#1f2e3a",
  },
  sliderHoverColor: {
    type: String,
    default: "#6f808d",
  },
  sliderBgHoverColor: {
    type: String,
    default: "#16222a",
  },
});

const emits = defineEmits<{
  (event: "dragging", left: number): void;
  (event: "isDragging", isDragging: boolean): void;
}>();

const left = ref(props.leftPercent);
const isDragging = ref(false);
const time = ref<number | null>(null);
const container = ref<HTMLDivElement | null>(null);

function mobileDragCol(e: TouchEvent) {
  if (container.value === null) return;
  e.stopPropagation();
  const oldPos = e.changedTouches[0].clientX;
  const oldPosPercent = left.value;
  let newPos = 0;
  let newPosPercent = 0;
  const containerWidth = container.value.offsetWidth;
  isDragging.value = true;
  document.ontouchmove = (ev) => {
    if (time.value && Date.now() - time.value < 40) return;
    time.value = Date.now();
    ev.stopPropagation();
    newPos = ev.changedTouches[0].clientX;
    const movingDistancePercent = parseFloat(
      (((oldPos - newPos) / containerWidth) * 100).toFixed(3)
    );
    newPosPercent = oldPosPercent - movingDistancePercent;
    if (newPosPercent <= 0) {
      left.value = 0;
    } else if (newPosPercent >= 100) {
      left.value = 100;
    } else {
      left.value = newPosPercent;
    }
    emits("dragging", left.value);
  };

  document.ontouchend = () => {
    isDragging.value = false;
    emits("isDragging", isDragging.value);
    document.ontouchmove = null;
    document.ontouchend = null;
  };
}

function dragCol(e: MouseEvent) {
  if (container.value === null) return;
  e.preventDefault();
  e.stopPropagation();
  const oldPos = e.clientX;
  const oldPosPercent = left.value;
  let newPos = 0;
  let newPosPercent = 0;
  const containerWidth = container.value.offsetWidth;
  isDragging.value = true;
  emits("isDragging", isDragging.value);
  document.onmousemove = (ev) => {
    // For what? I don't know
    // if (time.value && Date.now() - time.value < 40) return;
    // time.value = Date.now();
    ev.preventDefault();
    ev.stopPropagation();
    newPos = ev.clientX;
    const movingDistancePercent = parseFloat(
      (((oldPos - newPos) / containerWidth) * 100).toFixed(3)
    );
    newPosPercent = oldPosPercent - movingDistancePercent;
    if (newPosPercent <= props.minLeft) {
      left.value = props.minLeft;
    } else if (newPosPercent >= props.maxLeft) {
      left.value = props.maxLeft;
    } else {
      left.value = newPosPercent;
    }
    emits("dragging", left.value);
  };
  document.onmouseup = () => {
    isDragging.value = false;
    emits("isDragging", isDragging.value);
    document.onmousemove = null;
    document.onmouseup = null;
  };
}
</script>
<style scoped>
.drager_col {
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
}
.drager_col * {
  box-sizing: border-box;
}
.drager_col > div {
  height: 100%;
}
.drager_left {
  padding-right: 10px;
}
.drager_left > div {
  height: 100%;
  overflow: hidden;
}
.drager_right {
  padding-left: 10px;
}
.drager_right > div {
  height: 100%;
  overflow: hidden;
}
.drager_col > .slider_col {
  transition: background 0.2s;
  position: relative;
  z-index: 1;
  cursor: col-resize;
  background: v-bind("sliderBgColor");
}
.drager_col > .slider_col:before {
  transition: background-color 0.2s;
  position: absolute;
  top: 50%;
  left: 31%;
  transform: translateY(-50%);
  content: "";
  display: block;
  width: 1px;
  height: 24%;
  min-height: 30px;
  max-height: 70px;
  background-color: v-bind("sliderColor");
}
.drager_col > .slider_col:after {
  transition: background-color 0.2s;
  position: absolute;
  top: 50%;
  right: 31%;
  transform: translateY(-50%);
  content: "";
  display: block;
  width: 1px;
  height: 24%;
  min-height: 30px;
  max-height: 70px;
  background-color: v-bind("sliderColor");
}
.drager_col > .slider_col:hover:before,
.drager_col > .slider_col:hover:after,
.drager_col > .slider_col:active:before,
.drager_col > .slider_col:active:after {
  background-color: v-bind("sliderHoverColor");
}
.drager_col > .slider_col:hover,
.drager_col > .slider_col:active {
  background: v-bind("sliderBgHoverColor");
}
</style>
