const ASSETS_BASE_URL =
  process.env.NEXT_PUBLIC_ASSETS_BASE_URL || "http://192.168.1.24:8000/public";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.24:8000/api/v1";
const WEBSITE_BASE_URL =
  process.env.NEXT_PUBLIC_WEBSITE_BASE_URL || "http://localhost:3000";
const PERSIST_VERSION = 1;
const PERSIST_KEY = "murarkey";
const FEATURE_FLAGS = {
  newFeature: true,
  experimentalFeature: false,
};

export {
  ASSETS_BASE_URL,
  API_BASE_URL,
  WEBSITE_BASE_URL,
  FEATURE_FLAGS,
  PERSIST_VERSION,
  PERSIST_KEY,
};
