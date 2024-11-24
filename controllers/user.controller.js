import zod from "zod";
import { User } from "../models/user.models.js";

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

export { userRegisterHandler, loginUserHandler, isAllowed };
