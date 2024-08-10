const CourseModel=require("../models/course.model.js")

const addCourse=async(data)=>{
    try {
        const response=await CourseModel.create({courseName:data.courseName,testFormUrl:data.testFormUrl})
        return response;

    } catch (error) {
        throw error;
    }
}

const getCourses=async(data)=>{
    try{
        const response=await CourseModel.find({});
        return response;
    }
    catch(error){
        throw error;
    }
}

const updateById = async (data) => {
    try {
        // Use the _id directly from the data
        const response = await CourseModel.findOneAndUpdate({ _id: data._id }, {
            courseName: data.courseName,
            testFormUrl: data.testFormUrl,
            applicantsEnrolled: data.applicantsEnrolled,
        }, { new: true }); // This returns the updated document

        return response;
    } catch (error) {
        throw error;
    }
};


const updateCourseByName = async (courseName, applicantId) => {
    try{
        const response=await CourseModel.findOneAndUpdate({courseName:courseName},{$push:{applicant:applicantId}})
        return response;
    }
    catch(error){
        throw error;
    }
}

const deleteById=async(deleteCourseId)=>{
    try {
        const response=await CourseModel.deleteOne({_id:deleteCourseId})
        console.log("Response",response)
        return response;
    } catch (error) {
        throw error;
    }
}

module.exports={
    addCourse,
    getCourses,
    updateById,
    updateCourseByName,
    deleteById,
}