import { describe, it, expect } from "vitest";
import { mediaSource, isVideoItem } from "./media";

describe("mediaSource", () => {
  it("returns the real url, not the thumbnail, for a video item", () => {
    const video = {
      type: "video",
      url: "https://cdn/x/clip.mp4",
      thumbnail: "https://cdn/x/clip_thumb.jpg",
    };
    // The bug: returning the thumbnail here fed a JPG to <video>, so it never played.
    expect(mediaSource(video)).toBe("https://cdn/x/clip.mp4");
  });

  it("falls back to thumbnail when there is no url", () => {
    expect(mediaSource({ thumbnail: "t.jpg" })).toBe("t.jpg");
  });

  it("passes a plain string through and honours the fallback", () => {
    expect(mediaSource("https://cdn/x/a.mp4")).toBe("https://cdn/x/a.mp4");
    expect(mediaSource(null, "/f.png")).toBe("/f.png");
  });
});

describe("isVideoItem", () => {
  it("detects a video by explicit type (plain or mime-ish)", () => {
    expect(isVideoItem({ type: "video", url: "x" })).toBe(true);
    expect(isVideoItem({ type: "video/mp4", url: "x" })).toBe(true);
  });

  it("detects a video by file extension when type is missing", () => {
    expect(isVideoItem({ url: "https://cdn/x/clip.MOV" })).toBe(true);
    expect(isVideoItem("https://cdn/x/clip.webm?token=1")).toBe(true);
  });

  it("treats images as non-video", () => {
    expect(isVideoItem({ type: "image", url: "a.jpg" })).toBe(false);
    expect(isVideoItem("https://cdn/x/a.png")).toBe(false);
    expect(isVideoItem(null)).toBe(false);
  });
});
