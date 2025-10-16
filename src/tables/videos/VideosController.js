const connectDB = require("../../config/db");

// ✅ Get all videos
exports.getVideos = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM videos ORDER BY orderno ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error: error.message });
  }
};

// ✅ Create new video
exports.createVideo = async (req, res) => {
  const { video_url, orderno } = req.body;
  if (!video_url || !orderno) {
    return res.status(400).json({ message: "video_url and orderno are required" });
  }

  try {
    const db = await connectDB();
    const [result] = await db.query(
      "INSERT INTO videos (video_url, orderno) VALUES (?, ?)",
      [video_url, orderno]
    );
    res.status(201).json({ id: result.insertId, video_url, orderno });
  } catch (error) {
    res.status(500).json({ message: "Error creating video", error: error.message });
  }
};

// ✅ Update video
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { video_url, orderno } = req.body;

  try {
    const db = await connectDB();
    await db.query(
      "UPDATE videos SET video_url = ?, orderno = ? WHERE id = ?",
      [video_url, orderno, id]
    );
    res.json({ message: "Video updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error: error.message });
  }
};

// ✅ Delete video
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    await db.query("DELETE FROM videos WHERE id = ?", [id]);
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error: error.message });
  }
};
