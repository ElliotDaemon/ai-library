import { eq, and, desc, sql, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, toolSubmissions, favorites, toolClicks, adminSettings, InsertToolSubmission, InsertFavorite, InsertToolClick } from "../drizzle/schema";
import { ENV } from './_core/env';
import crypto from 'crypto';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// Hash IP address for privacy
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + ENV.cookieSecret).digest('hex').substring(0, 64);
}

// Hash passkey for secure storage
export function hashPasskey(passkey: string): string {
  return crypto.createHash('sha256').update(passkey).digest('hex');
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Tool Submissions ============

export async function createToolSubmission(submission: Omit<InsertToolSubmission, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(toolSubmissions).values(submission);
  return result;
}

export async function getToolSubmissions(status?: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    return [];
  }

  if (status) {
    return db.select().from(toolSubmissions).where(eq(toolSubmissions.status, status)).orderBy(desc(toolSubmissions.createdAt));
  }
  return db.select().from(toolSubmissions).orderBy(desc(toolSubmissions.createdAt));
}

export async function updateToolSubmissionStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(toolSubmissions).set({ status }).where(eq(toolSubmissions.id, id));
}

export async function updateToolSubmissionAiValidation(id: number, aiValidated: boolean, aiScore: number | null, aiNotes: string | null) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(toolSubmissions).set({ 
    aiValidated, 
    aiScore, 
    aiNotes 
  }).where(eq(toolSubmissions.id, id));
}

// ============ Favorites ============

export async function getFavoritesByIpHash(ipHash: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(favorites).where(eq(favorites.ipHash, ipHash));
}

export async function addFavorite(favorite: Omit<InsertFavorite, 'id' | 'createdAt'>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Check if already favorited
  const existing = await db.select().from(favorites)
    .where(and(
      eq(favorites.ipHash, favorite.ipHash),
      eq(favorites.toolId, favorite.toolId)
    ))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyExists: true };
  }

  await db.insert(favorites).values(favorite);
  return { alreadyExists: false };
}

export async function removeFavorite(ipHash: string, toolId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(favorites).where(
    and(
      eq(favorites.ipHash, ipHash),
      eq(favorites.toolId, toolId)
    )
  );
}

export async function isFavorited(ipHash: string, toolId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  const result = await db.select().from(favorites)
    .where(and(
      eq(favorites.ipHash, ipHash),
      eq(favorites.toolId, toolId)
    ))
    .limit(1);

  return result.length > 0;
}

// ============ Click Tracking ============

export async function recordToolClick(click: Omit<InsertToolClick, 'id' | 'clickedAt'>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(toolClicks).values(click);
}

export async function getTrendingTools(limit: number = 20, daysBack: number = 7) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  // Get click counts grouped by tool
  const result = await db
    .select({
      toolId: toolClicks.toolId,
      toolName: toolClicks.toolName,
      toolUrl: toolClicks.toolUrl,
      category: toolClicks.category,
      clickCount: sql<number>`COUNT(*)`.as('clickCount'),
    })
    .from(toolClicks)
    .where(gte(toolClicks.clickedAt, cutoffDate))
    .groupBy(toolClicks.toolId, toolClicks.toolName, toolClicks.toolUrl, toolClicks.category)
    .orderBy(desc(sql`clickCount`))
    .limit(limit);

  return result;
}

// ============ Admin Settings ============

export async function getAdminSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) {
    return null;
  }

  const result = await db.select().from(adminSettings).where(eq(adminSettings.settingKey, key)).limit(1);
  return result.length > 0 ? result[0].settingValue : null;
}

export async function setAdminSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(adminSettings).values({ settingKey: key, settingValue: value })
    .onDuplicateKeyUpdate({ set: { settingValue: value } });
}

export async function verifyAdminPasskey(passkey: string): Promise<boolean> {
  const storedHash = await getAdminSetting('admin_passkey');
  if (!storedHash) {
    return false;
  }
  return hashPasskey(passkey) === storedHash;
}
