import { defineConfig, loadEnv } from "vite";
import dotfiles from "@dotenvx/dotenvx";

export default defineConfig(({ command, mode }) => {
  const processEnv = {};
  // the path array in `dotfiles.config` does not load files sequentially.
  // force the defaults to load first
  dotfiles.config({
    processEnv,
    path: [
      "../config/dotfiles/.env.keys", // decryption keys
      "../config/dotfiles/.env", // default
    ],
  });

  // then overwrite the defaults with specified file data
  dotfiles.config({
    processEnv,
    path: [
      ...((process.env?.LOAD_ADDITIONAL as unknown as string)?.split("|") ||
        ""),
    ],
    override: true,
  });

  // const env = loadEnv(mode, process.cwd(), ""); // loads unencrypted if desired
  return {
    define: {
      __ENV_DOT_FILES__: JSON.stringify(processEnv), // pass unencrypted to rendered env
    },
  };
});
