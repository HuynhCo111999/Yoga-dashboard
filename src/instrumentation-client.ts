import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 0.1,
  enableLogs: true,
  replaysOnErrorSampleRate: 1,
  replaysSessionSampleRate: 0.01,
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
