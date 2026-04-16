<template>
  <div class="progress-bar">
    <div :class="['progress-bar-fill', progressColor]" :style="{ width: progress + '%' }"></div>
    <span class="progress-bar-text">{{ progress }}%</span>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
    },
  },
  computed: {
    progressColor() {
      if (this.progress >= 75) {
        return 'progress-bar-high';
      } else if (this.progress >= 50) {
        return 'progress-bar-medium';
      } else {
        return 'progress-bar-low';
      }
    },
  },
};
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 25px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bar-fill {
  height: 100%;
  background-color: #28a745; /* Default to green for high progress */
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 40px 40px;
  animation: progress-bar-stripes 1s linear infinite;
  transition: width 0.4s ease;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

@keyframes progress-bar-stripes {
  0% {
    background-position: 40px 0;
  }
  100% {
    background-position: 0 0;
  }
}

.progress-bar-text {
  position: absolute;
  font-weight: bold;
  color: #fff;
  z-index: 1;
}

.progress-bar-low {
  background-color: #dc3545; /* Red color for low progress */
}

.progress-bar-medium {
  background-color: #ffc107; /* Yellow color for medium progress */
}

.progress-bar-high {
  background-color: #28a745; /* Green color for high progress */
}
</style>
