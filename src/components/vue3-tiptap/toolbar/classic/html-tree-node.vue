<template>
  <div class="html-tree-node">
    <!-- 开标签 -->
    <div class="tag-line" @click="toggleExpand">
      <span class="toggle-icon" v-if="hasChildren">
        <svg :style="{ transform: expanded ? 'rotate(90deg)' : '' }" width="12" height="12" viewBox="0 0 12 12">
          <path fill="currentColor" d="M3 2l6 4-6 4z" />
        </svg>
      </span>
      <span v-else class="toggle-placeholder"></span>

      <span class="tag-bracket">&lt;</span>
      <span class="tag-name">{{ node.tag }}</span>
      <span v-for="(value, key) in node.attrs" :key="key" class="tag-attr">
        <span class="attr-name">{{ key }}</span>
        <span class="attr-equal">=</span>
        <span class="attr-value">"{{ value }}"</span>
      </span>
      <span v-if="!hasChildren" class="tag-bracket">/</span>
      <span class="tag-bracket">&gt;</span>
    </div>

    <!-- 子元素 -->
    <div v-if="hasChildren && expanded" class="children" :style="{ marginLeft: '16px' }">
      <!-- 文本节点 -->
      <template v-for="(child, index) in node.children" :key="index">
        <div v-if="typeof child === 'string' && child.trim()" class="text-node">
          {{ child }}
        </div>
        <HtmlTreeNode
          v-else-if="typeof child === 'object'"
          :node="child"
          :initial-expanded="initialExpanded"
          @collapsed="$emit('collapsed')"
        />
      </template>
    </div>

    <!-- 闭标签 -->
    <div v-if="hasChildren && expanded" class="tag-line">
      <span class="toggle-placeholder"></span>
      <span class="tag-bracket">&lt;/</span>
      <span class="tag-name">{{ node.tag }}</span>
      <span class="tag-bracket">&gt;</span>
    </div>

    <!-- 自闭合标签的闭标签占位 -->
    <div v-else-if="hasChildren && !expanded" class="tag-line collapsed-end">
      <span class="tag-bracket">...</span>
      <span class="tag-bracket">&lt;/</span>
      <span class="tag-name">{{ node.tag }}</span>
      <span class="tag-bracket">&gt;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface HtmlNode {
  tag: string;
  attrs: Record<string, string>;
  children: Array<HtmlNode | string>;
  html: string;
}

interface Props {
  node: HtmlNode;
  initialExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialExpanded: true
});

defineEmits<{
  collapsed: [];
}>();

const expanded = ref(props.initialExpanded);

const hasChildren = computed(() => {
  return props.node?.children && props.node.children.length > 0;
});

const toggleExpand = () => {
  if (hasChildren.value) {
    expanded.value = !expanded.value;
  }
};
</script>

<style scoped>
.html-tree-node {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-color, #333);
}

.tag-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  cursor: default;
  user-select: none;
  align-items: center;
  padding: 2px 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.tag-line:hover {
  background-color: var(--hover-bg, rgba(24, 144, 255, 0.1));
}

.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toggle-icon:hover {
  color: #1890ff;
}

.toggle-placeholder {
  display: inline-block;
  width: 16px;
  flex-shrink: 0;
}

.tag-bracket {
  color: var(--syntax-tag, #881280);
  font-weight: 600;
}

.tag-name {
  color: var(--syntax-tag, #881280);
  font-weight: 600;
  margin: 0 4px;
}

.tag-attr {
  margin-left: 4px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

.attr-name {
  color: var(--syntax-attr-name, #ff8c42);
  font-weight: 500;
}

.attr-equal {
  color: var(--syntax-equal, #666);
  margin: 0 2px;
}

.attr-value {
  color: var(--syntax-attr-value, #28a745);
}

.children {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.text-node {
  padding: 2px 4px;
  color: var(--text-color, #333);
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
}

.collapsed-end {
  opacity: 0.6;
  font-style: italic;
}
</style>
