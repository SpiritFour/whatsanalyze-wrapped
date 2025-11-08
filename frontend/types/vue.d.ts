import { composer as VueI18nComposer } from 'vue-i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: VueI18nComposer['t']
    $i18n: VueI18nComposer
  }
}

export {}
