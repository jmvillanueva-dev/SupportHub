/**
 * API Route: Get Current User
 * GET /api/auth/me
 */
const { getDatabase } = require("../../../src/infrastructure/database/sqlite");
const SQLiteUserRepository = require("../../../src/infrastructure/repositories/SQLiteUserRepository");
const { getSession } = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = getSession(req);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: "Not authenticated",
    });
  }

  try {
    const db = getDatabase();
    const userRepository = new SQLiteUserRepository(db);
    const user = userRepository.findById(session.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("[API /auth/me] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
