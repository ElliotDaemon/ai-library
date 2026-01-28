import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("Admin Passkey Configuration", () => {
  it("should have ADMIN_PASSKEY environment variable set", () => {
    // Check that the admin passkey is configured
    const adminPasskey = process.env.ADMIN_PASSKEY;
    
    expect(adminPasskey).toBeDefined();
    expect(adminPasskey).not.toBe("");
    expect(typeof adminPasskey).toBe("string");
    
    // Passkey should be at least 8 characters for security
    expect(adminPasskey!.length).toBeGreaterThanOrEqual(8);
  });

  it("should not expose passkey in client-side code", () => {
    // Ensure the passkey is not in any VITE_ prefixed env vars
    const viteEnvKeys = Object.keys(process.env).filter(key => key.startsWith("VITE_"));
    const hasExposedPasskey = viteEnvKeys.some(key => 
      process.env[key]?.includes(process.env.ADMIN_PASSKEY || "")
    );
    
    expect(hasExposedPasskey).toBe(false);
  });
});
