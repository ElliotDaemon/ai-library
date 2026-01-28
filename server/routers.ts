import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createToolSubmission, 
  getFavoritesByIpHash, 
  addFavorite, 
  removeFavorite, 
  hashIp,
  recordToolClick,
  getTrendingTools,
  getToolSubmissions,
  updateToolSubmissionStatus,
  updateToolSubmissionAiValidation,
  verifyAdminPasskey,
  setAdminSetting,
  hashPasskey,
  getAdminSetting
} from "./db";
import { invokeLLM } from "./_core/llm";

// Helper to get client IP from request
function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

// AI validation for tool submissions
async function validateToolWithAI(toolName: string, toolUrl: string, description: string | null): Promise<{
  isValid: boolean;
  score: number;
  notes: string;
}> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an AI tool validator. Your job is to determine if a submitted tool is a legitimate AI tool or service. 
          
Evaluate based on:
1. Is the name appropriate and not offensive?
2. Does the URL look legitimate (not spam, not inappropriate)?
3. Does the description (if provided) describe an AI-related tool?
4. Is this likely a real AI product/service?

Respond with JSON only: {"isValid": boolean, "score": number (0-100), "notes": "brief explanation"}`
        },
        {
          role: "user",
          content: `Validate this tool submission:
Name: ${toolName}
URL: ${toolUrl}
Description: ${description || 'Not provided'}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "tool_validation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              isValid: { type: "boolean", description: "Whether this is a valid AI tool submission" },
              score: { type: "integer", description: "Confidence score 0-100" },
              notes: { type: "string", description: "Brief explanation of the validation result" }
            },
            required: ["isValid", "score", "notes"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("AI validation error:", error);
  }

  // Default to pending manual review if AI fails
  return { isValid: true, score: 50, notes: "AI validation unavailable, pending manual review" };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Tool Submissions with AI validation
  submissions: router({
    create: publicProcedure
      .input(z.object({
        toolName: z.string().min(1).max(256),
        toolUrl: z.string().url().max(512),
        category: z.string().max(128).optional(),
        description: z.string().max(2000).optional(),
        submitterEmail: z.string().email().max(320).optional(),
        isHiddenGem: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const clientIp = getClientIp(ctx.req);
        const ipHash = hashIp(clientIp);
        
        // Create submission first
        const result = await createToolSubmission({
          toolName: input.toolName,
          toolUrl: input.toolUrl,
          category: input.category || null,
          description: input.description || null,
          submitterEmail: input.submitterEmail || null,
          ipHash,
          isHiddenGem: input.isHiddenGem || false,
          aiValidated: false,
          aiScore: null,
          aiNotes: null,
        });

        // Run AI validation asynchronously (don't block the response)
        validateToolWithAI(input.toolName, input.toolUrl, input.description || null)
          .then(async (validation) => {
            // Get the submission ID from the result
            const submissions = await getToolSubmissions('pending');
            const submission = submissions.find(s => 
              s.toolName === input.toolName && 
              s.toolUrl === input.toolUrl &&
              s.ipHash === ipHash
            );
            
            if (submission) {
              await updateToolSubmissionAiValidation(
                submission.id,
                validation.isValid,
                validation.score,
                validation.notes
              );
              
              // Auto-reject if score is too low (likely spam/inappropriate)
              if (validation.score < 30) {
                await updateToolSubmissionStatus(submission.id, 'rejected');
              }
            }
          })
          .catch(console.error);

        return { success: true };
      }),
  }),

  // IP-based Favorites
  favorites: router({
    list: publicProcedure.query(async ({ ctx }) => {
      const clientIp = getClientIp(ctx.req);
      const ipHash = hashIp(clientIp);
      return getFavoritesByIpHash(ipHash);
    }),

    add: publicProcedure
      .input(z.object({
        toolId: z.string().min(1).max(128),
        toolName: z.string().min(1).max(256),
        toolUrl: z.string().max(512).optional(),
        category: z.string().max(128).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const clientIp = getClientIp(ctx.req);
        const ipHash = hashIp(clientIp);
        
        const result = await addFavorite({
          ipHash,
          toolId: input.toolId,
          toolName: input.toolName,
          toolUrl: input.toolUrl || null,
          category: input.category || null,
        });

        return result;
      }),

    remove: publicProcedure
      .input(z.object({
        toolId: z.string().min(1).max(128),
      }))
      .mutation(async ({ ctx, input }) => {
        const clientIp = getClientIp(ctx.req);
        const ipHash = hashIp(clientIp);
        
        await removeFavorite(ipHash, input.toolId);
        return { success: true };
      }),
  }),

  // Click Tracking for Trending
  clicks: router({
    record: publicProcedure
      .input(z.object({
        toolId: z.string().min(1).max(128),
        toolName: z.string().min(1).max(256),
        toolUrl: z.string().max(512).optional(),
        category: z.string().max(128).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const clientIp = getClientIp(ctx.req);
        const ipHash = hashIp(clientIp);
        
        await recordToolClick({
          toolId: input.toolId,
          toolName: input.toolName,
          toolUrl: input.toolUrl || null,
          category: input.category || null,
          ipHash,
        });

        return { success: true };
      }),

    trending: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(50).optional(),
        daysBack: z.number().min(1).max(30).optional(),
      }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit || 20;
        const daysBack = input?.daysBack || 7;
        return getTrendingTools(limit, daysBack);
      }),
  }),

  // Admin Dashboard
  admin: router({
    // Verify passkey login
    login: publicProcedure
      .input(z.object({
        passkey: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const isValid = await verifyAdminPasskey(input.passkey);
        return { success: isValid };
      }),

    // Set passkey (first time setup)
    setPasskey: publicProcedure
      .input(z.object({
        passkey: z.string().min(8).max(128),
        currentPasskey: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Check if passkey already exists
        const existingPasskey = await getAdminSetting('admin_passkey');
        
        if (existingPasskey) {
          // Verify current passkey before allowing change
          if (!input.currentPasskey) {
            return { success: false, error: 'Current passkey required' };
          }
          const isValid = await verifyAdminPasskey(input.currentPasskey);
          if (!isValid) {
            return { success: false, error: 'Invalid current passkey' };
          }
        }

        // Set new passkey
        await setAdminSetting('admin_passkey', hashPasskey(input.passkey));
        return { success: true };
      }),

    // Get pending submissions (requires passkey in header)
    getSubmissions: publicProcedure
      .input(z.object({
        passkey: z.string().min(1),
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      }))
      .query(async ({ input }) => {
        const isValid = await verifyAdminPasskey(input.passkey);
        if (!isValid) {
          return { success: false, submissions: [], error: 'Invalid passkey' };
        }

        const submissions = await getToolSubmissions(input.status);
        return { success: true, submissions };
      }),

    // Update submission status
    updateStatus: publicProcedure
      .input(z.object({
        passkey: z.string().min(1),
        submissionId: z.number(),
        status: z.enum(['pending', 'approved', 'rejected']),
      }))
      .mutation(async ({ input }) => {
        const isValid = await verifyAdminPasskey(input.passkey);
        if (!isValid) {
          return { success: false, error: 'Invalid passkey' };
        }

        await updateToolSubmissionStatus(input.submissionId, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
