<template>
  <div :class="'panel' + ' ' + type">
    <div class="panel-header">
      <p class="panel-title">{{title}}</p>
    </div>
    <div class="panel-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  padding: 2rem;
  border: 1px solid #e5e5e5;
  margin-bottom: 3rem;
  .panel-content {
    overflow: hidden;
    margin: 2rem 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .panel-header {
    margin: -2rem -2rem 2rem -2rem;
    .panel-title {
      padding-left: 2rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
      font-size: 1.5rem;
    }
  }

  // 各个类型对应的样式
  &.default {
    border: 1px solid #f0f0f0;
    .panel-header {
      background-color: #f0f0f0;
    }
  }
  &.info {
    border: 1px solid #409eff;
    .panel-header {
      background-color: #409eff;
    }
  }
  &.success {
    border: 1px solid #21ba45;
    .panel-header {
      background-color: #21ba45;
    }
  }
  &.warning {
    border: 1px solid #f0c36d;
    .panel-header {
      background-color: #f9edbe;
    }
  }
  &.danger {
    border: 1px solid #cb2431;
    .panel-header {
      background-color: #cb2431;
      .panel-title {
        color: #fff;
      }
    }
  }
}
</style>

<script>
export default {
  props: {
    title: {
      type: String
    },
    type: {
      type: String,
      default: "default",
      required: false
    }
  }
};
</script>


