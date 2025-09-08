import { Member, Package } from "@/lib/api/types";

export interface PackageValidityResult {
  isValid: boolean;
  isExpired: boolean;
  daysRemaining: number;
  expiryDate: Date | null;
  errorMessage?: string;
}

/**
 * Check if a member's package is still valid
 */
export function checkPackageValidity(
  member: Member,
  packageData: Package
): PackageValidityResult {
  // If member has no package
  if (!member.currentPackage || !member.packageStartDate) {
    return {
      isValid: false,
      isExpired: false,
      daysRemaining: 0,
      expiryDate: null,
      errorMessage: "Thành viên chưa có gói tập",
    };
  }

  // If package doesn't match
  if (member.currentPackage !== packageData.id) {
    return {
      isValid: false,
      isExpired: false,
      daysRemaining: 0,
      expiryDate: null,
      errorMessage: "Gói tập không khớp",
    };
  }

  // Parse dates safely using local date components to avoid ISO/UTC pitfalls
  const [sy, sm, sd] = member.packageStartDate.split("-").map(Number);
  const startDate = new Date(sy, (sm || 1) - 1, sd || 1, 0, 0, 0, 0);
  // Duration is inclusive: 30-day package starting 09-06 ends on 10-05 (inclusive)
  const expiryDate = new Date(startDate);
  expiryDate.setDate(expiryDate.getDate() + (packageData.duration - 1));

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  expiryDate.setHours(23, 59, 59, 999); // Set to end of expiry day

  const isExpired = today > expiryDate;
  const daysRemaining = Math.max(
    0,
    Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    isValid: !isExpired,
    isExpired,
    daysRemaining,
    expiryDate,
    errorMessage: isExpired
      ? `Gói tập đã hết hạn từ ${daysRemaining} ngày trước`
      : undefined,
  };
}

/**
 * Check if a member's package is valid on a specific date (YYYY-MM-DD)
 */
export function checkPackageValidityOnDate(
  member: Member,
  packageData: Package,
  targetDateStr: string
): PackageValidityResult {
  // Base validity (ensures fields exist and package matches)
  const base = checkPackageValidity(member, packageData);
  if (!base.expiryDate) return base;

  // Compare target date end-of-day with expiry end-of-day
  const [ty, tm, td] = targetDateStr.split("-").map(Number);
  const target = new Date(ty, (tm || 1) - 1, td || 1, 23, 59, 59, 999);

  const isExpiredOnDate = target > base.expiryDate;
  const msDiff = base.expiryDate.getTime() - target.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msDiff / (1000 * 60 * 60 * 24)));

  return {
    isValid: !isExpiredOnDate && base.isValid,
    isExpired: isExpiredOnDate,
    daysRemaining,
    expiryDate: base.expiryDate,
    errorMessage: isExpiredOnDate
      ? `Gói tập hết hạn trước ngày lớp (${targetDateStr})`
      : base.errorMessage,
  };
}

/**
 * Format package validity information for display
 */
export function formatPackageValidity(validity: PackageValidityResult): string {
  if (!validity.isValid) {
    return validity.errorMessage || "Gói tập không hợp lệ";
  }

  if (validity.daysRemaining === 0) {
    return "Gói tập hết hạn hôm nay";
  } else if (validity.daysRemaining === 1) {
    return "Gói tập hết hạn ngày mai";
  } else if (validity.daysRemaining <= 7) {
    return `Gói tập còn ${validity.daysRemaining} ngày`;
  } else {
    return `Gói tập còn ${validity.daysRemaining} ngày`;
  }
}

/**
 * Check if member can register for a class based on package validity
 */
export function canMemberRegisterForClass(
  member: Member,
  packageData: Package
): {
  canRegister: boolean;
  reason?: string;
  validity: PackageValidityResult;
} {
  const validity = checkPackageValidity(member, packageData);

  if (!validity.isValid) {
    return {
      canRegister: false,
      reason: validity.errorMessage,
      validity,
    };
  }

  // Check if member is active
  if (member.membershipStatus !== "active") {
    return {
      canRegister: false,
      reason: "Tài khoản thành viên không hoạt động",
      validity,
    };
  }

  return {
    canRegister: true,
    validity,
  };
}
