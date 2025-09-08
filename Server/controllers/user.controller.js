import uploadCloudinary from "../config/cloudinary.js";
import geminiResponse from "../Gemini.js";
import User from "../models/user.model.js";
// import moment from "moment";
import moment from "moment-timezone";


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "assistant update error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    user.history.push(command);
    user.save();
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ respponse: "Sorry I Can't Understand.." });
    }

    const geminiResult = JSON.parse(jsonMatch[0]);
    const type = geminiResult.type;
    // const userInput = geminiResult.userInput;
    // const responseText = geminiResult.response;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Current date is ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Current time is ${moment().tz("Asia/Kolkata").format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Today is ${moment().tz("Asia/Kolkata").format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `The month is ${moment().tz("Asia/Kolkata").format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: geminiResult.response,
        });
      default:
        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    return res.status(500).json({ response: "Assistant error" });
  }
};
