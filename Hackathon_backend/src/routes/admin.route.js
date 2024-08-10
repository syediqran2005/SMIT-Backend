const express = require("express");
const route = express.Router();
const authenticated = require("../Middlewares/auth.js");
const {
  login,
  createApplicant,
  getSingleApplicantById,
  getAllApplicant,
  getApplicantByCnic,
  getApplicantByRollno,
  deleteApplicantByCnic,
  updateApplicantByCnic,
  deleteApplicantByRollNo,
} = require("../controllers/admin.controller.js");
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
} = require("../controllers/course.controller.js");

route.get("/login", login);
route.post("/create-applicant", createApplicant); // checking
route.get("/get-applicant/:applicantId", getSingleApplicantById);
route.get("/get-applicant-by-cnic/:cnic", authenticated, getApplicantByCnic);
route.get(
  "/get-applicant-by-rollno/:rollno",
  getApplicantByRollno
);
route.get("/get-all-applicants", getAllApplicant);
route.delete(
  "/delete-applicant-by-cnic/:cnic",
  deleteApplicantByCnic
);
route.delete(
  "/delete-applicant-by-rollno/:rollNo",
  deleteApplicantByRollNo
);
route.put("/update-applicant-by-cnic", updateApplicantByCnic);
route.post("/create-course", createCourse);
route.get("/get-all-courses", getAllCourses);
route.get("get-course-by-id/:courseId",getCourseById)
route.put("/update-course-by-id", updateCourseById);
route.delete("/delete-course-by-id/:id", deleteCourseById);

module.exports = { route };