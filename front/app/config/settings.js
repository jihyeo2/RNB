import Constants from "expo-constants";

const settings = {
  dev: {
    apiUrl: "https://git.heroku.com/danbi2021.git/api",
  },
  staging: {
    apiUrl: "https://git.heroku.com/danbi2021.git/api",
  },
  prod: {
    apiUrl: "https://git.heroku.com/danbi2021.git/api",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
