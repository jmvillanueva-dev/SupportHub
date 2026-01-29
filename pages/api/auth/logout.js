/**
 * API Route: Logout
 * POST /api/auth/logout
 */
const { clearSession } = require("../../../src/shared/utils/cookies");

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearSession(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
