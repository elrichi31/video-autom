import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

// ─── Output ───────────────────────────────────────────────────────────────────
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(100);          // max quality for intermediate frames
Config.setOverwriteOutput(true);

// ─── Video codec & quality ────────────────────────────────────────────────────
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");    // TikTok/Reels/Shorts compatibility
Config.setCrf(1);                    // near-lossless (0 = lossless, 18 = default)

// ─── Renderer (Windows: angle > swiftshader default) ─────────────────────────
Config.setChromiumOpenGlRenderer("angle");

// ─── Webpack ──────────────────────────────────────────────────────────────────
Config.overrideWebpackConfig(enableTailwind);
