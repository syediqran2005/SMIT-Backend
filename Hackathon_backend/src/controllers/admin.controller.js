const Admin = require("../models/admin.model.js");
const {
  newApplicant,
  allApplicants,
  getApplicantById,
  getByCnic,
  getByRollno,
  deleteByRollNo,
  deleteByCnic,
  updateByCnic,
} = require("../services/applicant.service.js");
const { updateCourseByName } = require("../services/course.service.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createApplicant = async (req, res) => {
  try {
    const ifApplicantAlreadyExists = await getByCnic(req.body.cnic);
    if(ifApplicantAlreadyExists){
      return res.json({message:"This user is already registered.."})
    }

    const addApplicant = await newApplicant(req.body);

    if (!addApplicant) {
      return res.status(400).json({
        success: false,
        message: "Applicant is not Added",
        data: null,
      });
    }

    updateCourseByName(req.body.course,addApplicant._id);

    return res.status(200).json({
      success: true,
      message: "Applicant Added Successfully",
      data: addApplicant,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const getSingleApplicantById = async (req, res) => {
  try {
    const applicantId = req.params.applicantId;
    const response = await getApplicantById(applicantId);
    if (!response)
      return res.status(400).json({
        success: false,
        message: `Could not find User by this ${applicantId} id `,
      });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllApplicant = async (req, res) => {
  try {
    const applicant = await allApplicants();
    if (!applicant)
      return res
        .status(400)
        .json({ success: false, message: "Sorry No User Found!", data: null });

    return res.status(200).json(applicant);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const getApplicantByCnic = async (req, res) => {
  try {
    let cnic = req.params.cnic;
    const getApplicant = await getByCnic(cnic);
    if (!getApplicant) {
      res.status(400).json({ message: "Applicant not found by ", cnic });
    }
    return res.status(200).json(getApplicant);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getApplicantByRollno = async (req, res) => {
  try {
    let rollNo = req.params.rollno;
    const getApplicant = await getByRollno(rollNo);
    if (!getApplicant) {
      res.status(400).json({ message: "Applicant not found by ", rollNo });
    }
    return res.status(200).json(getApplicant);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteApplicantByCnic = async (req, res) => {
  try {
    const applicantCnic = req.params.cnic;
    const deleteApplicant = await deleteByCnic(applicantCnic);
    if (!deleteApplicant)
      return res.status(400).json({
        message: `Applicant not deleted by this ${applicantCnic} cnic`,
      });
    return res.status(201).json(deleteApplicant);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteApplicantByRollNo = async (req, res) => {
  try {
    const applicantRollNo = req.params.rollNo;  // Ensure this matches the parameter name in the URL
    const deleteApplicant = await deleteByRollNo(applicantRollNo);
    if (!deleteApplicant || deleteApplicant.deletedCount === 0) {
      return res.status(400).json({
        message: `Applicant not deleted for roll number ${applicantRollNo}`,
      });
    }
    return res.status(200).json({ message: `Applicant with roll number ${applicantRollNo} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateApplicantByCnic = async (req, res) => {
  try {
    const { cnic, rollNumber } = req.body;  // Adjust based on the actual key you're using

    console.log("Received request to update:", req.body);

    if (!cnic && !rollNumber) {  // Check both fields
      return res.status(400).json({ message: 'CNIC or Roll Number is required for updating applicant' });
    }

    // Assuming updateByCnic is a function that updates an applicant by CNIC
    const updateApplicant = await updateByCnic(req.body);

    if (!updateApplicant) {
      return res
        .status(400)
        .json({ message: `User has not been updated by ${cnic || rollNumber}` });
    }

    return res.status(201).json(updateApplicant);  
  } catch (error) {
    console.error("Error updating applicant:", error);
    return res.status(500).json({ message: error.message });
  }
};


// const updateApplicantByCnic = async (req, res) => {
//   try {
//     const { cnic, rollNumber } = req.body;  // Extract cnic and rollNumber from the request body

//     console.log("Received request to update:", req.body);

//     if (!cnic && !rollNumber) {
//       return res.status(400).json({ message: 'CNIC or Roll Number is required for updating applicant' });
//     }

//     const updateApplicant = await updateByCnic(req.body);
//     if (!updateApplicant)
//       return res
//         .status(400)
//         .json({ message: `user has not been updated by ${cnic} cnic` });
//     return res.status(201).json(updateApplicant);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };





const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Admin.findOne({ email });

    if (!user) return res.json({ message: "User Not Found", success: false });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res
        .status(400)
        .json({ message: "Invalid Credential", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res
      .status(200)
      .json({ message: `Welcome ${user.name}`, token, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createCourse=async(req,res)=>{
//   try {
//     const {courseName}=req.body
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// }

module.exports = {
  login,
  createApplicant,
  getAllApplicant,
  getSingleApplicantById,
  getApplicantByCnic,
  getApplicantByRollno,
  deleteApplicantByCnic,
  deleteApplicantByRollNo,
  updateApplicantByCnic,
};
