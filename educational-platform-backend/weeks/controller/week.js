const Week = require('../model/week');  
// const Course = require('../courses/model/course');

exports.addWeek = async (req, res) => {
  try {
    const { courseId, weekNumber, title, description, lessons } = req.body;

    // const course = await Course.findById(courseId);
    // if (!course) {
    //   return res.status(404).json({ message: 'Course not found' });
    // }
    
    const existingWeek = await Week.findOne({ courseId, weekNumber });
    if (existingWeek) {
      return res.status(400).json({ message: 'Week already exists for this course' });
    }

    
    const newWeek = new Week({
      courseId,
      weekNumber,
      title,
      description,
      lessons
    });

    const savedWeek = await newWeek.save();
    res.status(201).json(savedWeek);
  } catch (error) {
    res.status(500).json({ message: 'Error adding week', error });
  }
};


exports.getWeeksForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const weeks = await Week.find({ courseId }).sort('weekNumber');  // Sort by week number
    res.status(200).json(weeks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weeks for the course', error });
  }
};


exports.getWeekById = async (req, res) => {
  try {
    const { id } = req.params;

    
    const week = await Week.findById(id);
    if (!week) {
      return res.status(404).json({ message: 'Week not found' });
    }
    res.status(200).json(week);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the week', error });
  }
};
