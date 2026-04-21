<template>
	<a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
	<div class="page-wrapper" :class="{ 'dark-mode': isDark }">
		<div class="app-header">
			<div class="header-left">
				<WechatOutlined class="logo-icon" />
				<h1>WeChat MP Editor</h1>
			</div>
			<div class="header-right">
				<div class="theme-switch" @click="toggleTheme">
					<svg v-if="!isDark" class="theme-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
					<svg v-else class="theme-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
				</div>
				<div class="divider"></div>
				<a-button class="header-btn">导入</a-button>
				<a-button type="primary" class="header-btn copy-btn" @click="copyContent">
					一键复制
				</a-button>
			</div>
		</div>

		<div class="editor-container">
			<div class="toggle-preview-btn" :class="{ 'is-active': showPreview }" @click="showPreview = !showPreview">
				<i class="ri-eye-line" v-if="!showPreview"></i>
				<i class="ri-eye-off-line" v-else></i>
			</div>
			<div class="preview-area" :class="{ 'is-hidden': !showPreview }">
				<div class="preview-frame">
					<div class="preview-header">公众号预览</div>
					<div class="preview-content tiptap" v-html="content"></div>
				</div>
			</div>
			<div class="editor-area">
				<Vue3Tiptap v-model:content="content" @update:modelValue="handleUpdate" />
			</div>
		</div>
	</div>
	</a-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { Vue3TipTap as Vue3Tiptap } from "@/components/vue3-tiptap/index";
import { WechatOutlined } from "@ant-design/icons-vue";
import { message, theme } from "ant-design-vue";

const content = ref("<p>欢迎使用微信公众号排版编辑器。🎉</p>");
const isDark = ref(false);

watch(isDark, (val) => {
	if (val) {
		document.body.classList.add('dark-mode');
	} else {
		document.body.classList.remove('dark-mode');
	}
});
const showPreview = ref(true);

const handleResize = () => {
	if (window.innerWidth < 1100) {
		showPreview.value = false;
	} else {
		showPreview.value = true;
	}
};

onMounted(() => {
	handleResize();
	window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});

const handleUpdate = (val: string) => {
        content.value = val;
};

const toggleTheme = () => {
        isDark.value = !isDark.value;
};

const copyContent = async () => {
        try {
                // 创建一个临时的不可见元素来承载要复制的 HTML
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content.value;
                tempDiv.style.position = "absolute";
                tempDiv.style.left = "-9999px";
                document.body.appendChild(tempDiv);

                // 选择内容
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(tempDiv);
                selection?.removeAllRanges();
                selection?.addRange(range);

                // 执行复制
                document.execCommand("copy");
                
                // 清理
                selection?.removeAllRanges();
                document.body.removeChild(tempDiv);
                
                message.success("已复制到剪贴板，可直接粘贴到微信公众号后台！");
        } catch (err) {
                message.error("复制失败，请重试");
        }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        transition: background-color 0.3s, color 0.3s;

        background-color: var(--bg-color);
        color: var(--text-color);
}

.app-header {
        height: 60px;
        background-color: var(--header-bg);
        border-bottom: 1px solid var(--header-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        flex-shrink: 0;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        .header-left {
                display: flex;
                align-items: center;
                gap: 12px;

                .logo-icon {
                        font-size: 24px;
                        color: #07c160; /* WeChat green */
                }

                h1 {
                        margin: 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #07c160;
                }

                .save-time {
                        margin-left: 16px;
                        font-size: 12px;
                        color: var(--text-secondary);
                }
        }

        .header-right {
                display: flex;
                align-items: center;
                gap: 16px;

                .theme-switch {
                        cursor: pointer;
                        font-size: 20px;
                        color: #faad14; /* Sun color */
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: transform 0.3s;

                        &:hover {
                                transform: scale(1.1);
                        }
                }

                .divider {
                        width: 1px;
                        height: 20px;
                        background-color: var(--header-border);
                }

                .header-btn {
                        background: transparent;
                        border-color: var(--header-border);
                        color: var(--text-color);

                        &:hover {
                                border-color: #07c160;
                                color: #07c160;
                        }
                }

                .copy-btn {
                        background-color: #07c160;
                        border-color: #07c160;
                        color: #fff;

                        &:hover {
                                background-color: #06ad56;
                                border-color: #06ad56;
                                color: #fff;
                        }
                }
        }
}

.editor-container {
	flex: 1;
	display: flex;
	flex-direction: row;
	padding: 20px;
	box-sizing: border-box;
	gap: 20px;
	overflow: hidden;
	position: relative;

	.toggle-preview-btn {
		display: none;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		background: var(--header-bg);
		border: 1px solid var(--frame-border);
		border-left: none;
		border-radius: 0 8px 8px 0;
		padding: 12px 4px;
		cursor: pointer;
		z-index: 100;
		color: var(--text-color);
		box-shadow: 2px 0 8px rgba(0,0,0,0.05);
		transition: all 0.3s;
		
		&:hover {
			color: #07c160;
		}

		&.is-active {
			left: 420px;
		}
	}

	@media (max-width: 1100px) {
		.toggle-preview-btn {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.preview-area {
			position: absolute;
			left: 20px;
			top: 20px;
			bottom: 20px;
			z-index: 99;
			background: var(--bg-color);
			transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

			&.is-hidden {
				transform: translateX(-120%);
			}
		}
	}

	.preview-area {
		width: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		transition: width 0.3s, margin 0.3s, opacity 0.3s;

		&.is-hidden {
			width: 0;
			margin: 0;
			opacity: 0;
			overflow: hidden;
		}

                .preview-frame {
                        width: 375px;
                        height: 100%;
                        background: var(--frame-bg);
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        border: 1px solid var(--frame-border);
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;

                        .preview-header {
                                height: 40px;
                                background: var(--header-bg);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 14px;
                                font-weight: 500;
                                color: var(--text-color);
                                border-bottom: 1px solid var(--frame-border);
                                flex-shrink: 0;
                        }

                        .preview-content {
                                flex: 1;
                                overflow-y: auto;
                                padding: 20px 16px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: var(--paper-text);
                                background: var(--paper-bg);
                                word-wrap: break-word;

                                /* 滚动条样式 */
                                &::-webkit-scrollbar {
                                        width: 4px;
                                }
                                &::-webkit-scrollbar-thumb {
                                        background: rgba(0,0,0,0.1);
                                        border-radius: 4px;
                                }
                        }
                }
        }

        .editor-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;

                :deep(.vue3-tiptap) {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        background: var(--editor-bg);
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        border: 1px solid var(--frame-border);
                        overflow: hidden;
        
                        .toolbar {
                                background: var(--editor-bg);
                                border-bottom: 1px solid var(--frame-border);
                        }

                        .editor-content {
                                flex: 1;
                                overflow-y: auto;
                                padding: 40px;
                                width: 800px;
                                margin: 0 auto;
                                background: var(--paper-bg);
                                min-height: 100%;
                                color: var(--paper-text);
                        }
                }
        }
}
</style>