import { specs } from "./index";

describe("Swagger specification", () => {
  it("should require bearer auth globally by default", () => {
    expect(specs.security).toEqual([{ bearerAuth: [] }]);
  });

  it("should keep public routes without authentication requirements", () => {
    expect(specs.paths["/health"].get.security).toEqual([]);
    expect(specs.paths["/session"].post.security).toEqual([]);
    expect(specs.paths["/password/forgot"].post.security).toEqual([]);
    expect(specs.paths["/password/reset"].post.security).toEqual([]);
  });

  it("should keep authenticated profile route protected", () => {
    expect(specs.paths["/me"].get.security).toBeUndefined();
  });
});
