import request from "supertest";
import app from "./app";

describe("HTTP app", () => {
  it("should return ok on health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("should expose swagger documentation", async () => {
    const response = await request(app).get("/api-docs/");

    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
    expect(response.text).toContain("swagger-ui-init.js");
  });

  it("should return a standardized 404 error for unknown routes", async () => {
    const response = await request(app).get("/missing-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Route not found" });
  });
});
