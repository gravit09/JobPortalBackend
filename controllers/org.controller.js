import { Organization } from "../models/org.models.js";
import { User } from "../models/user.models.js";
import zod from "zod";

const orgSchema = zod.object({
  name: zod.string(),
  description: zod.string(),
  size: zod.string(),
  founded: zod.number(),
  imageUrl: zod.string(),
  type: zod.string(),
});

//create Org
const createOrgHandler = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json("User ID is required");
    }

    const parsedData = orgSchema.safeParse(data);
    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid Data Sent",
        errors: parsedData.error.errors,
      });
    }

    // Check if an organization with the same name already exists
    const isOrgExist = await Organization.findOne({ name: data.name });
    if (isOrgExist) {
      return res.status(409).json("Organization with this name already exists");
    }

    // Check if the user has already created an organization
    const user = await User.findById(userId);
    if (user.organization != null) {
      return res.status(409).json("You are already part of an organization");
    }

    // Create the organization and update the user's profile
    const org = await Organization.create(parsedData.data);
    await User.findByIdAndUpdate(
      userId,
      { organization: org._id },
      { new: true }
    );

    return res.status(201).json({
      message: "Organization created successfully",
      organization: org,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json("Something went wrong while adding the organization");
  }
};

const getAllOrgs = async (req, res) => {
  try {
    const allOrgs = await Organization.find();
    if (!allOrgs) {
      return res.status(200).json("No Oragnization listed Yet");
    }
    return res.status(200).json({
      message: "Orgs Fetched Successfully",
      allOrgs,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getYourOrg = async (req, res) => {
  const userId = req.userId;
  const { organization } = await User.findById({ _id: userId });
  try {
    const yourOrgDetails = await Organization.findById({ _id: organization });
    return res.status(200).json({
      message: true,
      yourOrgDetails,
    });
  } catch (err) {
    console.log("Something went wrong while fetching your org", err);
    res.status(500).message("Something went wrong on our side");
  }
};

export { createOrgHandler, getAllOrgs, getYourOrg };
