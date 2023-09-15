import React, { useState, useEffect } from "react";
import LessonForm from "./LessonForm";
import "./coursedetail.css";

const CourseDetail = ({ course, onClose }) => {
  const [courseDetails, setCourseDetails] = useState(course);
  const [lessons, setLessons] = useState([]);

  const loadLessons = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/lectures/?id=${course._id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLessons(data);
      } else {
        console.error("Failed to fetch lessons");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  return (
    <div className="course-detail-modal">
      <div className="course-detail-content">
        <span className="course-detail-close-button" onClick={onClose}>
          &times;
        </span>
        <div className="course-info">
          <img src={courseDetails.image} alt={courseDetails.courseName} />
          <h2>{courseDetails.courseName}</h2>
          <p>Instructor: {courseDetails.instructor}</p>
          <p>Rating: {courseDetails.rating}</p>
          <p>No. of Students: {courseDetails.noOfStudents}</p>
          <p>Price: {courseDetails.price}</p>
          <p>Category: {courseDetails.category}</p>
          {/* Add more course details here */}
        </div>
        <div className="lesson-form">
          <LessonForm
            courseId={courseDetails._id}
            onLessonAdded={loadLessons}
          />
        </div>
      </div>
      {/* Display Lectures Section */}
      <div className="lessons">
        <h3>Lessons</h3>
        {lessons.map((lesson) => (
          <div key={lesson._id} className="lesson">
            <h4>{lesson.title}</h4>
            {/* Display the video and content here */}
            <p>{lesson.videoLink}</p>
            <p>{lesson.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
