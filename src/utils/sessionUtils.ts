/**
 * Utility functions for session management
 */

export interface SessionTimeInfo {
  canCancel: boolean;
  timeUntilSession: number; // minutes
  timeUntilSessionText: string;
  isPastSession: boolean;
}

/**
 * Check if a session can be cancelled (must be at least 1 hour before start time)
 * @param sessionDate - Date in YYYY-MM-DD format
 * @param sessionStartTime - Time in HH:MM format
 * @returns SessionTimeInfo object with cancellation status and time info
 */
export function checkSessionCancellationTime(
  sessionDate: string,
  sessionStartTime: string
): SessionTimeInfo {
  try {
    // Parse session date and time
    const [year, month, day] = sessionDate.split("-").map(Number);
    const [hours, minutes] = sessionStartTime.split(":").map(Number);

    // Create session start datetime
    const sessionStart = new Date(year, month - 1, day, hours, minutes);

    // Get current time
    const now = new Date();

    // Calculate time difference in minutes
    const timeDiffMs = sessionStart.getTime() - now.getTime();
    const timeDiffMinutes = Math.floor(timeDiffMs / (1000 * 60));

    // Check if session is in the past
    const isPastSession = timeDiffMinutes < 0;

    // Can cancel if at least 60 minutes (1 hour) before session start
    const canCancel = timeDiffMinutes >= 60;

    // Format time until session
    let timeUntilSessionText = "";
    if (isPastSession) {
      timeUntilSessionText = "Đã qua";
    } else if (timeDiffMinutes < 60) {
      timeUntilSessionText = `${timeDiffMinutes} phút nữa`;
    } else if (timeDiffMinutes < 1440) {
      // Less than 24 hours
      const hours = Math.floor(timeDiffMinutes / 60);
      const remainingMinutes = timeDiffMinutes % 60;
      timeUntilSessionText =
        remainingMinutes > 0
          ? `${hours} giờ ${remainingMinutes} phút nữa`
          : `${hours} giờ nữa`;
    } else {
      const days = Math.floor(timeDiffMinutes / 1440);
      timeUntilSessionText = `${days} ngày nữa`;
    }

    return {
      canCancel,
      timeUntilSession: timeDiffMinutes,
      timeUntilSessionText,
      isPastSession,
    };
  } catch (error) {
    console.error("Error checking session cancellation time:", error);
    return {
      canCancel: false,
      timeUntilSession: 0,
      timeUntilSessionText: "Lỗi thời gian",
      isPastSession: true,
    };
  }
}

/**
 * Format session date and time for display
 * @param sessionDate - Date in YYYY-MM-DD format
 * @param sessionStartTime - Time in HH:MM format
 * @returns Formatted date and time string
 */
export function formatSessionDateTime(
  sessionDate: string,
  sessionStartTime: string
): string {
  try {
    const date = new Date(sessionDate);
    const formattedDate = date.toLocaleDateString("vi-VN");
    return `${formattedDate} lúc ${sessionStartTime}`;
  } catch (error) {
    console.error("Error formatting session date time:", error);
    return `${sessionDate} lúc ${sessionStartTime}`;
  }
}
