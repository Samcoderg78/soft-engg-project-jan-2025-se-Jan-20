const Course = require('../model/course');

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