process.env.STORAGE_DIR = process.env.STORAGE_DIR || "test-storage";

const fs = require("fs");
const { createdDate } = require("../../../utils/files");

describe("createdDate", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("uses the birth time when the filesystem recorded one", () => {
    const birthtime = new Date("2024-01-02T03:04:05Z");
    const mtime = new Date("2024-06-01T00:00:00Z");
    jest.spyOn(fs, "statSync").mockReturnValue({
      birthtimeMs: birthtime.getTime(),
      birthtime,
      mtimeMs: mtime.getTime(),
      mtime,
    });

    expect(createdDate("/tmp/notes.pdf")).toBe(birthtime.toLocaleString());
  });

  test("falls back to mtime when birth time is the epoch", () => {
    const mtime = new Date("2024-05-01T08:30:00Z");
    jest.spyOn(fs, "statSync").mockReturnValue({
      birthtimeMs: 0,
      birthtime: new Date(0),
      mtimeMs: mtime.getTime(),
      mtime,
    });

    expect(createdDate("/tmp/notes.pdf")).toBe(mtime.toLocaleString());
    expect(createdDate("/tmp/notes.pdf")).not.toBe("unknown");
  });

  test("returns unknown when neither clock is usable", () => {
    jest.spyOn(fs, "statSync").mockReturnValue({
      birthtimeMs: 0,
      birthtime: new Date(0),
      mtimeMs: 0,
      mtime: new Date(Number.NaN),
    });
    expect(createdDate("/tmp/notes.pdf")).toBe("unknown");
  });

  test("returns unknown when the file cannot be stat'd", () => {
    jest.spyOn(fs, "statSync").mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(createdDate("/tmp/missing.pdf")).toBe("unknown");
  });
});
