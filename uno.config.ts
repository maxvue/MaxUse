import presetAttributify from '@unocss/preset-attributify';
import presetIcons from '@unocss/preset-icons';
import presetWind3 from '@unocss/preset-wind3';
import { presetMaxUno } from '@maxvue/max-components-ui/preset';
import { defineConfig } from '@unocss/vite';
import { transformerVariantGroup } from 'unocss';


export default defineConfig({
    shortcuts: [],
    transformers: [transformerVariantGroup()],
    presets: [
        presetMaxUno(),
        presetWind3(),
        presetAttributify(),
        presetIcons()
    ],
    safelist: ['Splitpanes', 'Pane']
});
