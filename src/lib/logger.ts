import * as Sentry from "@sentry/nextjs";

export type LogLevel = "debug" | "info" | "warning" | "error" | "fatal";

export interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger utility to log events to console and Sentry
 */
export const logger = {
  /**
   * Log a debug message
   */
  debug: (message: string, context?: LogContext) => {
    console.debug(`[DEBUG] ${message}`, context || "");

    Sentry.addBreadcrumb({
      category: "debug",
      message,
      level: "debug",
      data: context,
    });
  },

  /**
   * Log an info message
   */
  info: (message: string, context?: LogContext) => {
    console.info(`[INFO] ${message}`, context || "");

    Sentry.addBreadcrumb({
      category: "info",
      message,
      level: "info",
      data: context,
    });
  },

  /**
   * Log a warning message
   */
  warning: (message: string, context?: LogContext) => {
    console.warn(`[WARNING] ${message}`, context || "");

    Sentry.addBreadcrumb({
      category: "warning",
      message,
      level: "warning",
      data: context,
    });

    // Optionally capture warnings in Sentry
    if (process.env.NODE_ENV === "production") {
      Sentry.captureMessage(message, {
        level: "warning",
        contexts: { extra: context },
      });
    }
  },

  /**
   * Log an error message and send to Sentry
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    console.error(`[ERROR] ${message}`, error, context || "");

    Sentry.addBreadcrumb({
      category: "error",
      message,
      level: "error",
      data: context,
    });

    // Capture error in Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        contexts: { extra: { message, ...context } },
      });
    } else {
      Sentry.captureMessage(message, {
        level: "error",
        contexts: { extra: { error, ...context } },
      });
    }
  },

  /**
   * Log a fatal error (critical system failure)
   */
  fatal: (message: string, error?: Error | unknown, context?: LogContext) => {
    console.error(`[FATAL] ${message}`, error, context || "");

    Sentry.addBreadcrumb({
      category: "fatal",
      message,
      level: "fatal",
      data: context,
    });

    // Capture fatal error in Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: "fatal",
        contexts: { extra: { message, ...context } },
      });
    } else {
      Sentry.captureMessage(message, {
        level: "fatal",
        contexts: { extra: { error, ...context } },
      });
    }
  },

  /**
   * Log a custom event (e.g., user actions, business events)
   */
  event: (eventName: string, data?: LogContext) => {
    console.log(`[EVENT] ${eventName}`, data || "");

    Sentry.addBreadcrumb({
      category: "event",
      message: eventName,
      level: "info",
      data,
    });
  },

  /**
   * Set user context for Sentry
   */
  setUser: (user: {
    id: string;
    email?: string;
    name?: string;
    role?: string;
  }) => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
      role: user.role,
    });

    console.log("[SENTRY] User context set:", user);
  },

  /**
   * Clear user context
   */
  clearUser: () => {
    Sentry.setUser(null);
    console.log("[SENTRY] User context cleared");
  },

  /**
   * Add custom context to all future events
   */
  setContext: (key: string, context: LogContext) => {
    Sentry.setContext(key, context);
    console.log(`[SENTRY] Context set [${key}]:`, context);
  },

  /**
   * Add a tag to all future events
   */
  setTag: (key: string, value: string) => {
    Sentry.setTag(key, value);
    console.log(`[SENTRY] Tag set [${key}]: ${value}`);
  },

  /**
   * Start a span for performance monitoring
   */
  startSpan: <T>(options: { name: string; op: string }, callback: () => T) => {
    console.log(`[SENTRY] Span started: ${options.name}`);
    return Sentry.startSpan(options, callback);
  },
};

/**
 * API Logger - specialized logger for API operations
 */
export const apiLogger = {
  request: (method: string, endpoint: string, params?: unknown) => {
    logger.info(`API Request: ${method} ${endpoint}`, {
      method,
      endpoint,
      params,
    });
  },

  response: (
    method: string,
    endpoint: string,
    status: number,
    data?: unknown
  ) => {
    const level = status >= 400 ? "error" : "info";
    if (level === "error") {
      logger.error(`API Error: ${method} ${endpoint} - ${status}`, undefined, {
        method,
        endpoint,
        status,
        data,
      });
    } else {
      logger.info(`API Response: ${method} ${endpoint} - ${status}`, {
        method,
        endpoint,
        status,
      });
    }
  },

  error: (method: string, endpoint: string, error: Error | unknown) => {
    logger.error(`API Error: ${method} ${endpoint}`, error as Error, {
      method,
      endpoint,
    });
  },
};

/**
 * Auth Logger - specialized logger for authentication operations
 */
export const authLogger = {
  login: (userId: string, email?: string) => {
    logger.event("User Login", { userId, email });
    logger.setUser({ id: userId, email: email || "" });
  },

  logout: (userId: string) => {
    logger.event("User Logout", { userId });
    logger.clearUser();
  },

  loginFailed: (email: string, reason: string) => {
    logger.warning("Login Failed", { email, reason });
  },

  signUp: (userId: string, email?: string) => {
    logger.event("User Sign Up", { userId, email });
    logger.setUser({ id: userId, email: email || "" });
  },
};

/**
 * Database Logger - specialized logger for database operations
 */
export const dbLogger = {
  query: (collection: string, operation: string, params?: unknown) => {
    logger.debug(`DB Query: ${operation} on ${collection}`, {
      collection,
      operation,
      params,
    });
  },

  error: (collection: string, operation: string, error: Error | unknown) => {
    logger.error(`DB Error: ${operation} on ${collection}`, error as Error, {
      collection,
      operation,
    });
  },

  success: (collection: string, operation: string, result?: unknown) => {
    logger.debug(`DB Success: ${operation} on ${collection}`, {
      collection,
      operation,
      result,
    });
  },
};

export default logger;
