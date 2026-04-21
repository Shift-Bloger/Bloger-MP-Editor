import { createApp } from "vue";
import App from "./App.vue";
import "./styles/reset.scss";
import "./styles/tiptap.scss";
import "./styles/uyghur-fonts.css";
import "remixicon/fonts/remixicon.css";

import AntdCom from "@/plugin/antd";
import router from './router/index'

const app = createApp(App);

app.use(AntdCom).use(router).mount("#app");
