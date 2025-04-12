<template>
  <div class="slide-verify">
    <!-- 验证提示文字 -->
<!--    <div class="verify-tips">{{ tipsText }}</div>-->

    <!-- 滑动轨道 -->
    <div
        class="verify-track"
        ref="track"
        @mousemove="handleMove"
        @mouseup="handleEnd"
        @mouseleave="handleEnd"
    >
      <!-- 滑动块 -->
      <div
          class="verify-thumb"
          :style="{ left: thumbLeft + 'px' }"
          @mousedown="handleStart"
      >
        <RightOutlined v-if="verifySuccess" class="success-icon"/>
        <DragOutlined v-else class="drag-icon"/>
      </div>

      <!-- 背景文字 -->
      <div class="track-text" :class="{active: verifySuccess, warning: warning}">{{ verifySuccess ? '验证通过' : '请按住滑块，拖动到最右边' }}</div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {RightOutlined, DragOutlined} from '@ant-design/icons-vue';

const props = defineProps({
  // 验证成功回调
  onSuccess: {
    type: Function,
    default: () => {
    }
  },
  warning: {
    type: Boolean,
    default: false
  }
});

const tipsText = ref('拖动滑块完成验证');
const thumbLeft = ref(0);
const isDragging = ref(false);
const verifySuccess = ref(false);
const trackWidth = ref(0);
const track = ref(null);

// 初始化轨道宽度
onMounted(() => {
  trackWidth.value = track.value.offsetWidth - 40; // 减去滑块宽度
});

const handleStart = () => {
  if (!verifySuccess.value) {
    isDragging.value = true;
    tipsText.value = '拖动滑块完成验证';
  }
};

const handleMove = (e) => {
  if (!isDragging.value || verifySuccess.value) return;

  const rect = track.value.getBoundingClientRect();
  let newLeft = e.clientX - rect.left - 20; // 计算滑块位置

  // 限制滑动范围
  if (newLeft < 0) newLeft = 0;
  if (newLeft > trackWidth.value) newLeft = trackWidth.value;

  thumbLeft.value = newLeft;

  // 到达终点
  if (newLeft >= trackWidth.value - 2) {
    verifySuccess.value = true;
    tipsText.value = '验证成功';
    props.onSuccess(); // 触发成功回调
    isDragging.value = false;
  }
};

const handleEnd = () => {
  if (!verifySuccess.value) {
    isDragging.value = false;
    thumbLeft.value = 0;
    tipsText.value = '验证失败，请重试';
  }
};

// 重置验证
const reset = () => {
  verifySuccess.value = false;
  thumbLeft.value = 0;
  tipsText.value = '拖动滑块完成验证';
};

defineExpose({reset});
</script>

<style scoped>
.slide-verify {
  width: 100%;
  padding: 0px 0;
  user-select: none;
}

.verify-tips {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.verify-track {
  position: relative;
  width: 100%;
  height: 40px;
  background: #f5f5f5;
  border-radius: 6px;
  overflow: hidden;
}

.verify-thumb {
  position: absolute;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 5%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.verify-thumb:active {
  cursor: grabbing;
  background: #f0fff0;
}

.track-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  pointer-events: none;
}

.warning{
  color: #ff0000;
}

.active{
  color: #52c41a;
}

.success-icon {
  color: #52c41a;
  font-size: 18px;
}

.drag-icon {
  color: #666;
  font-size: 16px;
}
</style>