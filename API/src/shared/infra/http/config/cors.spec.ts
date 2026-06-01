import { resolveCorsOptions } from "./cors";

describe("resolveCorsOptions", () => {
  it("should allow any origin when no environment variable is provided", () => {
    expect(resolveCorsOptions()).toEqual({
      origin: true,
      credentials: true,
    });
  });

  it("should normalize comma separated origins", () => {
    expect(
      resolveCorsOptions("http://localhost:3000, http://localhost:5173")
    ).toEqual({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    });
  });

  it("should allow any origin when wildcard is configured", () => {
    expect(resolveCorsOptions("*")).toEqual({
      origin: true,
      credentials: true,
    });
  });
});
