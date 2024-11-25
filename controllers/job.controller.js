import { Job } from "../models/job.models.js";
import { Organization } from "../models/org.models.js";
import { User } from "../models/user.models.js";
import { z } from "zod";

//Data validation
const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().optional().default("Remote"),
  description: z.string(),
  requirements: z.object({
    experience: z.string().min(1, "Experience is required"),
    skills: z.array(z.string()).nonempty("Skills are required"),
    qualifications: z.string().min(1, "Qualifications are required"),
  }),
  responsibilities: z
    .array(z.string())
    .nonempty("Responsibilities are required"),
  applyLink: z.string().url("Invalid URL format for apply link"),
});

const listJobHandler = async (req, res) => {
  try {
    const data = req.body;

    // Validate the incoming data with Zod schema
    const isValidData = jobSchema.safeParse(data);
    if (!isValidData.success) {
      return res.status(406).json({
        error: "Invalid data sent",
        details: isValidData.error.errors,
      });
    }

    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const organization = await Organization.findById(user.organization);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    const { name: organizationName, _id: organizationId } = organization;
    const newJobData = {
      ...isValidData.data,
      organization: organizationId,
      organizationName,
    };

    const newJob = await Job.create(newJobData);

    return res.status(201).json({
      message: "Job listed successfully",
      job: newJob,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Something went wrong while listing the job",
      error: err.message,
    });
  }
};

//To get all the Jobs
const getAllJobHandler = async (req, res) => {
  try {
    const allJobs = await Job.find();

    if (!allJobs) {
      return res.status(200).json("No Job Listed Yet");
    }

    return res.status(200).json({
      message: "job Fetch succesfull",
      allJobs,
    });
  } catch (err) {
    return res.status(500).json("Something went wrong while fetching Jobs");
  }
};

//get all the jobs listed by an specific org
const getOrgJobListings = async (req, res) => {
  const userId = req.userId;
  const { organization } = await User.findById({ _id: userId });
  try {
    const jobsListedByThisOrg = await Job.find({ organization });
    if (jobsListedByThisOrg.length === 0) {
      return res.status(200).json({
        message: "No job is currently listed by this organization.",
        jobsListedByThisOrg,
      });
    }
    return res.status(200).json({
      message: "All jobs fetched successfully.",
      jobsListedByThisOrg,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong while fetching jobs." });
  }
};

const deleteAnJob = async (req, res) => {
  const jobId = req.body;
  try {
    const response = await Job.deleteOne({ _id: jobId });
    if (response)
      return res.status(200).json({ message: "job listing deleted" });
  } catch (err) {
    console.log("something went wrong while deleting job", err);
  }
};

export { listJobHandler, getAllJobHandler, getOrgJobListings, deleteAnJob };
