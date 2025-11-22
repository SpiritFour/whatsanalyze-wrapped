const local = process.env.NUXT_ENV_LOCAL !== undefined;
const run_with_functions = process.env.NUXT_ENV_WITH_FUNCTIONS !== undefined;
const env = process.env.NUXT_ENV_ENV || "prod";
const baseUrl = (
    process.env.BASE_URL || "https://www.wrapped.whatsanalyze.com"
).replace("http:", "https:");


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: {enabled: true},

    app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        },
        {name: 'color-scheme', content: 'dark'},
        {name: 'theme-color', content: '#000'}, // status bar / PWA tint
      ]
    }
  },/* full static rendering */
    ssr: false,

    modules: [
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
        "@nuxt/content",
        "@pinia/nuxt",
        "pinia-plugin-persistedstate/nuxt",
        "~/modules/firebase",
    ],
    // there is no official nuxt3 firebase plugin anymore, so we implemented our own in modules/firebase.ts
    firebase: {
        dev:
            {
                apiKey: "AIzaSyCCX536nN4oTAXj49M_M1ZShD3ekLdjkBo",
                authDomain: "whatsanalyze-wrapped.firebaseapp.com",
                projectId: "whatsanalyze-wrapped",
                storageBucket: "whatsanalyze-wrapped.firebasestorage.app",
                messagingSenderId: "761196645139",
                appId: "1:761196645139:web:88191b29876feb404ae8e6",
                measurementId: "G-KEE2KV93SK",
            },
        prod:{
            apiKey: "AIzaSyBaVob5g3xHdzJnkOI2dtbdYND-__Tzutc",
            authDomain: "whatsanalyze-wrapped-prod.firebaseapp.com",
            projectId: "whatsanalyze-wrapped-prod",
            storageBucket: "whatsanalyze-wrapped-prod.firebasestorage.app",
            messagingSenderId: "1053765361889",
            appId: "1:1053765361889:web:feb439fa8220fadf1157a0",
            measurementId: "G-XJDRX60BNX"
        }
    }[env] ,// automatically select the correct environment,

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    css: ["~/assets/css/main.css"],

    pinia: {
        storesDirs: ["./store/**"],
    },

    i18n: {
        strategy: "prefix",
        locales: [
            {
                code: "en",
                iso: "en-US",
            },
            {
                code: "de",
                iso: "de-DE",
            },
            {
                code: "es",
                iso: "es-ES",
            },
            {
                code: "fr",
                iso: "fr-FR",
            },
            {
                code: "pt",
                iso: "pt-PT",
            },
            {
                code: "it",
                iso: "it-IT",
            },
        ],
        defaultLocale: "en",
        bundle: {
            optimizeTranslationDirective: false,
        },
    },

    runtimeConfig: {
        // everything that is not in public is only to the server available
        public: {
            local,
            run_with_functions,
            env,
            baseUrl,
            paypalClientId: local
                ? "ARYQUp4C_oNjNUNkvSPzLeaiulItDmnHUU226OANt2haCKC2c70ZrKZTmRHCPldcu4SD22LmPEuonfec"
                : "AUMWxSZrtBOA1RicR_3nGijYb8yYxyq2lxBjiwoQKfVc-8jfdPr5N7X5EFUackMCLb_K7HiKswnDBUJ8",
        },
        // eslint-disable-next-line no-undef
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    },
    typescript: {
        typeCheck: true,
    },
});
