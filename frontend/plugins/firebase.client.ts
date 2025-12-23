import {initializeApp} from "firebase/app";
import type {Firestore} from "firebase/firestore";
import {getFirestore} from "firebase/firestore";
import {getFunctions,connectFunctionsEmulator} from "firebase/functions";
import type {Functions} from "firebase/functions";
import {getAnalytics} from "firebase/analytics";
import type {Analytics} from "firebase/analytics";


export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    // Access the options defined in nuxt.config.ts
    const firebaseOptions = config.public.firebase;
    const firebaseApp = initializeApp(firebaseOptions);

    console.log("Currently active project:", firebaseOptions.projectId);
    const firestore = getFirestore(firebaseApp);
    const functions = getFunctions(firebaseApp);
    const analytics = getAnalytics(firebaseApp);

    if (config.public.run_with_functions) {
        console.log("Running locally, connecting to local functions..")
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        console.log("✓ Connected to Functions emulator at 127.0.0.1:5001");
    }
    nuxtApp.provide("firestore", firestore);
    nuxtApp.provide("functions", functions);
    nuxtApp.provide("analytics", analytics);
});

declare module "#app" {
    interface NuxtApp {
        $firestore: Firestore;
        $functions: Functions;
        $analytics: Analytics;
    }
}
