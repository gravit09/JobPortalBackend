import zod from "zod";
import { User } from "../models/user.models.js";
import { JobApplication } from "../models/JobApplication.model.js";

//User Input Validation
const userSchema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(8),
});

//User Regstration
const userRegisterHandler = async (req, res) => {
  const userData = req.body;
  const isValidData = userSchema.safeParse(userData);

  if (!isValidData.success) {
    return res
      .status(401)
      .json({ error: "Invalid Data Sent", details: isValidData.error.errors });
  }

  const isUserExist = await User.findOne({
    $or: [{ username: userData.username }, { email: userData.email }],
  });

  if (isUserExist) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password,
  });

  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    return res.status(501).json("Something went wrong while creating User");
  }

  return res.status(201).json({
    message: "User Registered SuccesFully",
    success: true,
    createdUser,
  });
};

//User Login
const loginUserHandler = async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    return res.status(200).json({
      success: false,
      message: "Invalid email",
    });
  }

  const isPassValid = await checkUser.isPasswordCorrect(password);

  if (!isPassValid) {
    return res.status(200).json({
      success: false,
      message: "invalid pass",
    });
  }

  const token = await checkUser.generateJWT(checkUser._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).cookie("AccessToken", token, options).json({
    success: true,
    message: "User logged in",
    token,
  });
};

//Route For Token Verification
const isAllowed = async (req, res) => {
  return res.status(200).json({
    message: "valid",
    success: true,
  });
};

//to apply a job
const applyJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.userId;

  try {
    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = new JobApplication({ userId, jobId });
    await application.save();

    res.status(201).json({ message: "Job applied successfully", application });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while applying", error });
    console.log(error);
  }
};

//to get applied job
const getAppliedJobs = async (req, res) => {
  const userId = req.userId;
  try {
    const applications = await JobApplication.find({ userId }).populate(
      "jobId"
    );
    res
      .status(200)
      .json({ message: "Applications fetched successfully", applications });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching applications",
      error,
    });
  }
};

export {
  userRegisterHandler,
  loginUserHandler,
  isAllowed,
  applyJob,
  getAppliedJobs,
};
