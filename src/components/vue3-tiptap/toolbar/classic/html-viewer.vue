<template>
  <a-modal
    v-model:visible="isVisible"
    :title="t('htmlViewer')"
    :width="1000"
    :ok-text="t('confirm')"
    :cancel-text="t('cancel')"
    :body-style="{ height: '55vh', overflow: 'hidden', padding: '16px' }"
    :class="['html-viewer-modal', isDarkMode ? 'dark-mode' : 'light-mode']"
    @ok="handleSave"
    @cancel="handleCancel"
  >
    <div class="html-viewer">
      <!-- 工具栏 -->
      <div class="viewer-toolbar">
        <div class="toolbar-left">
          <a-button-group>
            <a-button type="primary" @click="toggleAllCollapse">
              {{ allExpanded ? t('collapseAll') : t('expandAll') }}
            </a-button>
            <a-button @click="copyToClipboard">
              {{ t('copy') }}
            </a-button>
            <a-button @click="formatHtml">
              {{ t('format') }}
            </a-button>
          </a-button-group>
        </div>
        <div class="toolbar-right">
          <span style="margin-right: 12px">{{ editMode ? t('edit') : t('preview') }}</span>
          <a-switch v-model:checked="editMode" />
        </div>
      </div>

      <!-- 预览模式 -->
      <div v-if="!editMode" class="html-preview">
        <div ref="codeContainer" class="code-tree">
          <HtmlTreeNode
            v-for="(node, index) in parsedNodes"
            :key="index"
            :node="node"
            :initial-expanded="allExpanded"
            @collapsed="onCollapsed"
          />
        </div>
      </div>

      <!-- 编辑模式 -->
      <div v-else class="html-edit">
        <a-textarea
          v-model:value="editHtml"
          :rows="20"
          :placeholder="t('pasteHtmlHere')"
          class="html-textarea"
          style="height: calc(55vh - 100px); resize: none;"
        />
        <a-alert
          v-if="parseError"
          :message="t('parseError')"
          :description="parseError"
          type="error"
          show-icon
          closable
          style="margin-top: 12px"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { message } from 'ant-design-vue';
import HtmlTreeNode from './html-tree-node.vue';
import type { Editor } from '@tiptap/core';

interface HtmlNode {
  tag: string;
  attrs: Record<string, string>;
  children: Array<HtmlNode | string>;
  html: string;
}

interface Props {
  editor: Editor;
  visible: boolean;
  closeModal: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [html: string];
}>();

const isVisible = computed({
  get: () => props.visible,
  set: (value) => {
    if (!value) {
      props.closeModal();
    }
  }
});

const editMode = ref(false);
const editHtml = ref('');
const parseError = ref('');
const allExpanded = ref(true);
const parsedNodes = ref<HtmlNode[]>([]);
const isDarkMode = ref(false);

const t = (key: string) => {
  const translations: Record<string, string> = {
    htmlViewer: 'HTML 代码',
    collapseAll: '全部合并',
    expandAll: '全部展开',
    copy: '复制',
    format: '格式化',
    edit: '编辑',
    preview: '预览',
    pasteHtmlHere: '在此粘贴 HTML 代码...',
    parseError: '解析错误',
    copied: '已复制到剪贴板',
    saved: '已成功保存',
    formatError: '格式化错误',
    confirm: '保存',
    cancel: '取消'
  };
  return translations[key] || key;
};

// 检查深色模式
const checkDarkMode = () => {
  isDarkMode.value = document.body.classList.contains('dark-mode');
};

// 监听深色模式变化
const setupDarkModeObserver = () => {
  const observer = new MutationObserver(() => {
    checkDarkMode();
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  return observer;
};

// 格式化 HTML
const formatHtmlString = (html: string): string => {
  let formatted = '';
  let indent = 0;
  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  // 替换 HTML 实体以避免解析问题
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  // 分割标签
  const tokens: string[] = [];
  let current = '';
  let inTag = false;

  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    
    if (char === '<') {
      if (current.trim()) {
        tokens.push(current.trim());
      }
      current = '<';
      inTag = true;
    } else if (char === '>' && inTag) {
      current += char;
      tokens.push(current);
      current = '';
      inTag = false;
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  // 格式化
  for (const token of tokens) {
    if (token.startsWith('</')) {
      // 闭标签
      indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + token + '\n';
    } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<!')) {
      // 开标签
      const tagMatch = token.match(/<(\w+)/);
      const tagName = tagMatch?.[1]?.toLowerCase() || '';
      
      formatted += '  '.repeat(indent) + token + '\n';
      
      if (!voidElements.has(tagName) && !token.endsWith('/>')) {
        indent++;
      }
    } else if (token.startsWith('<!--') || token.startsWith('<!')) {
      // 注释和特殊标签
      formatted += '  '.repeat(indent) + token + '\n';
    } else if (token.startsWith('<') && token.endsWith('/>')) {
      // 自闭合标签
      formatted += '  '.repeat(indent) + token + '\n';
    } else if (token.trim()) {
      // 文本内容
      formatted += '  '.repeat(indent) + token + '\n';
    }
  }

  return formatted;
};

// 解析 HTML
const parseHtml = (html: string): HtmlNode[] => {
  const nodes: HtmlNode[] = [];
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const parseNode = (node: Node): HtmlNode | string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node as Text).textContent?.trim();
      return text || '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const children: Array<HtmlNode | string> = [];

      for (let i = 0; i < el.childNodes.length; i++) {
        const child = parseNode(el.childNodes[i]);
        if (child) {
          children.push(child);
        }
      }

      return {
        tag: el.tagName.toLowerCase(),
        attrs: Array.from(el.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {} as Record<string, string>),
        children,
        html: el.outerHTML
      };
    }

    return '';
  };

  for (let i = 0; i < temp.childNodes.length; i++) {
    const parsed = parseNode(temp.childNodes[i]);
    if (parsed) {
      nodes.push(parsed as HtmlNode);
    }
  }

  return nodes;
};

// 更新内容
const updateContent = () => {
  const html = props.editor.getHTML();
  editHtml.value = formatHtmlString(html);
  try {
    parsedNodes.value = parseHtml(html);
    parseError.value = '';
  } catch (e) {
    parseError.value = (e as Error).message;
  }
};

// 保存
const handleSave = () => {
  if (editMode.value) {
    try {
      // 验证 HTML
      const temp = document.createElement('div');
      temp.innerHTML = editHtml.value;
      
      // 更新编辑器
      props.editor.commands.setContent(editHtml.value, false);
      emit('update', editHtml.value);
      
      message.success(t('saved'));
      props.closeModal();
    } catch (e) {
      parseError.value = (e as Error).message;
    }
  } else {
    props.closeModal();
  }
};

// 取消
const handleCancel = () => {
  editMode.value = false;
  props.closeModal();
};

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    const html = editMode.value ? editHtml.value : props.editor.getHTML();
    await navigator.clipboard.writeText(html);
    message.success(t('copied'));
  } catch (e) {
    message.error((e as Error).message);
  }
};

// 格式化 HTML
const formatHtml = () => {
  try {
    if (editMode.value) {
      editHtml.value = formatHtmlString(editHtml.value);
      message.success('格式化成功');
    }
  } catch (e) {
    message.error(t('formatError'));
  }
};

// 切换全部展开/合并
const toggleAllCollapse = () => {
  allExpanded.value = !allExpanded.value;
};

// 监听折叠事件
const onCollapsed = () => {
  // 监听子组件的折叠事件
};

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    checkDarkMode();
    updateContent();
    editMode.value = false;
    allExpanded.value = true;
  }
}, { immediate: false });
</script>

<style scoped>
.html-viewer-modal {
  --text-color: #333;
  --bg-color: #fff;
  --border-color: #d9d9d9;
  --code-bg: #f5f5f5;
  --hover-bg: rgba(24, 144, 255, 0.1);
}

.html-viewer-modal.dark-mode {
  --text-color: #e5e5e5;
  --bg-color: #1f1f1f;
  --border-color: #434343;
  --code-bg: #0d1117;
  --hover-bg: rgba(24, 144, 255, 0.15);
}

.html-viewer-modal.light-mode {
  --text-color: #333;
  --bg-color: #fff;
  --border-color: #d9d9d9;
  --code-bg: #f5f5f5;
  --hover-bg: rgba(24, 144, 255, 0.1);
}

.html-viewer {
  color: var(--text-color);
  font-size: 14px;
}

.viewer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.html-preview {
  background-color: var(--code-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 12px;
  height: calc(55vh - 100px);
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
}

.code-tree {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.html-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.html-textarea) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Courier New', monospace !important;
  font-size: 12px !important;
  line-height: 1.6 !important;
  background-color: var(--code-bg) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

:deep(.html-textarea textarea) {
  background-color: var(--code-bg) !important;
  color: var(--text-color) !important;
}

:deep(.ant-input) {
  background-color: var(--code-bg) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

:deep(.ant-input:hover) {
  border-color: #40a9ff !important;
}

:deep(.ant-input:focus) {
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
}

:deep(.ant-btn) {
  border-color: var(--border-color);
  color: var(--text-color);
  height: 32px;
  font-size: 14px;
  padding: 4px 15px;
}

:deep(.ant-btn-primary) {
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

:deep(.ant-btn-primary:hover) {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

:deep(.ant-btn:hover) {
  color: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-button-group > .ant-btn) {
  height: 32px;
  font-size: 14px;
  padding: 4px 15px;
}

:deep(.ant-alert) {
  background-color: var(--code-bg);
  border-color: var(--border-color);
  color: var(--text-color);
}

:deep(.ant-switch-checked) {
  background-color: #1890ff !important;
}

/* 深色模式下的 scrollbar */
:deep(.html-preview::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.html-preview::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.html-preview::-webkit-scrollbar-thumb) {
  background-color: var(--border-color);
  border-radius: 4px;
}

:deep(.html-preview::-webkit-scrollbar-thumb:hover) {
  background-color: #999;
}
</style>
