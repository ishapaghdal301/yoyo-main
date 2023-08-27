import React, { useState } from "react";
import "./AddCourse.css"; // Import your CSS file for styling
import { NavLink } from "react-router-dom";

function AddCourse() {
  const [courseData, setCourseData] = useState({
    category: "",
    courseName: "",
    courseDescription: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your course submission logic here
    console.log("Course data submitted:", courseData);
    // Reset the form
    setCourseData({
      category: "",
      courseName: "",
      courseDescription: ""
    });
  };

  return (
    <div className="add-course">
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={courseData.category}
          onChange={handleInputChange}
        />
        <label htmlFor="courseName">Course Name</label>
        <input
          type="text"
          id="courseName"
          name="courseName"
          value={courseData.courseName}
          onChange={handleInputChange}
        />
        <label htmlFor="courseDescription">Course Description</label>
        <textarea
          id="courseDescription"
          name="courseDescription"
          value={courseData.courseDescription}
          onChange={handleInputChange}
        />
        <NavLink to="addcourse"> {/* Remove the /teacherhome prefix */}
  <button type="submit" className="submit-button">
    Add Course
  </button>
</NavLink>

        
      </form>
    </div>
  );
}

export default AddCourse;
