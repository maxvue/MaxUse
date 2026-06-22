// import 'virtual:uno.css';
// import '@unocss/reset/normalize.css';

import { createApp } from 'vue';
import MaxComponentsUi from '../../src/index';
import App from './App.vue';
import ptBR from '../../src/locales/pt-br';

const app = createApp(App);

// Configurar MaxComponentsUi (inclui PrimeVue automaticamente)
app.use(MaxComponentsUi, {
    locale: ptBR
});

app.mount('#app');
