const { collectorHeadlessMode } = require("../../utils/browserLaunch");

function withPlatform(platform, run) {
  const descriptor = Object.getOwnPropertyDescriptor(process, "platform");
  Object.defineProperty(process, "platform", { configurable: true, value: platform });
  try {
    return run();
  } finally {
    if (descriptor) Object.defineProperty(process, "platform", descriptor);
    else delete process.platform;
  }
}

describe("collectorHeadlessMode", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  });

  test("uses the new headless mode outside macOS development", () => {
    process.env.NODE_ENV = "development";
    expect(withPlatform("linux", () => collectorHeadlessMode())).toBe("new");

    process.env.NODE_ENV = "production";
    expect(withPlatform("darwin", () => collectorHeadlessMode())).toBe("new");
  });

  test("returns boolean false on macOS development so Chrome is actually headed", () => {
    process.env.NODE_ENV = "development";
    const mode = withPlatform("darwin", () => collectorHeadlessMode());
    expect(mode).toBe(false);
    expect(typeof mode).toBe("boolean");
  });
});
