import { User } from "../models/user.models.js";
const isOrg = async (req, res, next) => {
  const userId = req.userId;
  const { organization } = await User.findById({ _id: userId });
  if (organization) {
    next();
  } else {
    return res.status(200).json({ message: false });
  }
};

export { isOrg };
