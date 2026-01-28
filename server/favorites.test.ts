import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({}),
  getFavoritesByIpHash: vi.fn().mockResolvedValue([]),
  addFavorite: vi.fn().mockResolvedValue({ success: true }),
  removeFavorite: vi.fn().mockResolvedValue(undefined),
  createToolSubmission: vi.fn().mockResolvedValue(undefined),
  hashIp: vi.fn().mockReturnValue("hashed-ip-address"),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

function createPublicContext(clientIp: string = "127.0.0.1"): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {
        "x-forwarded-for": clientIp,
      },
      ip: clientIp,
      connection: {
        remoteAddress: clientIp,
      },
    } as unknown as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("favorites router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list favorites for an IP address", async () => {
    const ctx = createPublicContext("192.168.1.1");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.list();

    expect(result).toEqual([]);
  });

  it("should add a favorite", async () => {
    const ctx = createPublicContext("192.168.1.1");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.add({
      toolId: "test-tool-id",
      toolName: "Test Tool",
      toolUrl: "https://test.com",
      category: "Testing",
    });

    expect(result).toEqual({ success: true });
  });

  it("should remove a favorite", async () => {
    const ctx = createPublicContext("192.168.1.1");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.remove({
      toolId: "test-tool-id",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("submissions router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new tool submission", async () => {
    const ctx = createPublicContext("192.168.1.1");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.submissions.create({
      toolName: "New AI Tool",
      toolUrl: "https://newtool.ai",
      category: "AI Assistants & Agents",
      description: "A great new AI tool",
      isHiddenGem: false,
    });

    expect(result).toEqual({ success: true });
  });
});
