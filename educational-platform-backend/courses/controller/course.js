const Course = require('../model/course');
const Enrollment = require('../../user/model/enrollment');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find(); 
    res.status(200).json(courses); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error });
  }
};


exports.addCourse = async (req, res) => {
  try {
    const { title, description, tags, professor, image } = req.body;

    const existingCourse = await Course.findOne({ title});
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this title already exists' });
    }
    
    const newCourse = new Course({
      title,
      description,
      tags,
      professor,
      image,
    });

    const savedCourse = await newCourse.save(); 
    res.status(201).json(savedCourse); 
  } catch (error) {
    res.status(500).json({ message: 'Error adding course', error });
  }
};


exports.deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;  // Get the course ID from the URL parameter
  
      // Find and delete the course with the given ID
      const deletedCourse = await Course.findByIdAndDelete(id);
      if (!deletedCourse) {
        return res.status(404).json({ message: 'Course not found' });  // If no course found, return a 404 error
      }
  
      res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting course', error });
    }
  };

  exports.getEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(500).json({ 
                message: 'Error fetching enrolled courses', 
                error: 'User ID is required' 
            });
        }

        // Get course IDs from enrollments
        const enrollments = await Enrollment.find({ user_id: userId });

        if (!enrollments.length) {
            return res.status(200).json([]); // Consistent with getAllCourses empty response
        }

        // Extract course IDs and get courses
        const courseIds = enrollments.map(enrollment => enrollment.course_id);
        const courses = await Course.find({ '_id': { $in: courseIds } });

        res.status(200).json({
          message: 'Enrolled courses retrieved successfully',
          data: courses
      });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrolled courses', error });
    }
};

// Add this to your controller/course.js file
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error });
  }
};

