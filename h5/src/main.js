import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { 
  Button,
  Form,
  Field,
  CellGroup,
  Toast,
  Icon
} from 'vant'
import 'vant/lib/index.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Button)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(Toast)
app.use(Icon)

app.mount('#app')
