export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const { trackPageView } = useAnalytics();
  trackPageView(to.fullPath, to.meta.title as string | undefined);
});
