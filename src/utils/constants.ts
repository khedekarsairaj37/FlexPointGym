// Constants for Flex Point Gym

// Secret key for admin registration (in production, use environment variables)
export const ADMIN_SECRET_KEY = 'FLEXPOINT_ADMIN_2024';

// Package prices in INR
export const PACKAGE_PRICES = {
  Free: 0,
  Pending: 0,
  Basic: 1500,
  Pro: 2500,
  Elite: 4000,
};

// Package features
export const PACKAGE_FEATURES = {
  Free: ['Access to basic equipment', 'Locker facility'],
  Basic: ['All Free features', 'Access to all equipment', 'Group classes', '1 Month validity'],
  Pro: ['All Basic features', 'Personal trainer (2 sessions/week)', 'Diet consultation', '3 Months validity', 'Supplement discount'],
  Elite: ['All Pro features', 'Unlimited personal training', 'Advanced diet plans', 'Priority booking', '6 Months validity', 'Free supplements'],
  Pending: ['Awaiting package selection'],
};

// Package durations in days
export const PACKAGE_DURATION = {
  Free: 0,
  Pending: 0,
  Basic: 30,
  Pro: 90,
  Elite: 180,
};
