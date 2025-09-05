// Export all API services and types
export * from "./types";
export * from "./base";
export * from "./members";
export * from "./packages";
export * from "./classes";
export * from "./sessions";
export * from "./dashboard";
export * from "./memberDashboard";

// Export API instances for easy import
export { membersApi } from "./members";
export { packagesApi } from "./packages";
export { classesApi } from "./classes";
export { sessionsApi } from "./sessions";
export { dashboardApi } from "./dashboard";
export { memberDashboardApi } from "./memberDashboard";

// Utility function to handle API responses consistently
export const handleApiResponse = <T>(
  response: { data: T | null; error: string | null; success: boolean },
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) => {
  if (response.success && response.data) {
    onSuccess?.(response.data);
    return response.data;
  } else {
    onError?.(response.error || "Đã xảy ra lỗi không xác định");
    console.error("API Error:", response.error);
    return null;
  }
};

// Loading states helper
export const createLoadingState = () => ({
  loading: false,
  error: null as string | null,
  data: null as unknown,
});

// Generic hook-like state manager for API calls
export class ApiState<T> {
  loading = false;
  error: string | null = null;
  data: T | null = null;

  setLoading(loading: boolean) {
    this.loading = loading;
    this.error = null;
  }

  setSuccess(data: T) {
    this.loading = false;
    this.error = null;
    this.data = data;
  }

  setError(error: string) {
    this.loading = false;
    this.error = error;
    this.data = null;
  }

  reset() {
    this.loading = false;
    this.error = null;
    this.data = null;
  }
}
