import Result from "../models/resultModels.js";

// CREATE RESULT
export async function createResult(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const {
      title,
      technology,
      level,
      totalQuestions,
      correct,
      wrong,
    } = req.body;

    if (
      !title ||
      !technology ||
      !level ||
      totalQuestions === undefined ||
      correct === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const payload = {
      user: req.user.id,
      title: title.trim(),
      technology: technology.toLowerCase(), 
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong:
        wrong !== undefined
          ? Number(wrong)
          : Math.max(0, Number(totalQuestions) - Number(correct)),
    };

    const created = await Result.create(payload);

    return res.status(201).json({
      success: true,
      message: "Result saved successfully",
      result: created,
    });
  } catch (error) {
    console.error("CreateResult Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// LIST RESULTS
export async function listResults(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { technology } = req.query;
    const query = { user: req.user.id };

    if (technology && technology.toLowerCase() !== "all") {
      query.technology = technology.toLowerCase(); 
    }

    const items = await Result.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      results: items,
    });
  } catch (error) {
    console.error("ListResult Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
