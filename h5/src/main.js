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
  Icon,
  Calendar,
  Tag,
  Swipe,
  SwipeItem,
  Circle,
  Progress,
  NavBar,
  Cell,
  Rate
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
app.use(Calendar)
app.use(Tag)
app.use(Swipe)
app.use(SwipeItem)
app.use(Circle)
app.use(Progress)
app.use(NavBar)
app.use(Cell)
app.use(Rate)

app.mount('#app')
