import pool from "../config/database.js";

// Get user's dashboard
export const getDashboard = async (req, res) => {
  const userId = req.user.userId;
  const client = await pool.connect();

  try {
    const result = await client.query(
      "SELECT widgets, updated_at FROM dashboards WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      // If no dashboard exists, create one with empty widgets
      await client.query(
        "INSERT INTO dashboards (user_id, widgets) VALUES ($1, $2)",
        [userId, JSON.stringify([])]
      );

      return res.json({
        success: true,
        widgets: [],
        updatedAt: new Date().toISOString(),
      });
    }

    const dashboard = result.rows[0];

    res.json({
      success: true,
      widgets: dashboard.widgets,
      updatedAt: dashboard.updated_at,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
    });
  } finally {
    client.release();
  }
};

// Save user's dashboard
export const saveDashboard = async (req, res) => {
  const userId = req.user.userId;
  const { widgets } = req.body;

  // Validation
  if (!widgets || !Array.isArray(widgets)) {
    return res.status(400).json({
      success: false,
      message: "Widgets must be an array",
    });
  }

  const client = await pool.connect();

  try {
    // Update or insert dashboard
    const result = await client.query(
      `INSERT INTO dashboards (user_id, widgets, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id)
       DO UPDATE SET widgets = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING updated_at`,
      [userId, JSON.stringify(widgets)]
    );

    res.json({
      success: true,
      message: "Dashboard saved successfully",
      widgets: widgets,
      updatedAt: result.rows[0].updated_at,
    });
  } catch (error) {
    console.error("Error saving dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error saving dashboard",
    });
  } finally {
    client.release();
  }
};
