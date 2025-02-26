const Lecture = require('../model/lecture');  
// const Week = require('../weeks/model/week');
// const Course = require('../courses/model/course');

exports.addLecture = async (req, res) => {
  try {
    const { course, week, lectureNumber, title, description, videoUrl } = req.body;

    // const existingCourse = await Course.findOne({ title: course });
    // if (!existingCourse) {
    //   return res.status(404).json({ message: 'Course not found' });
    // }

    // const existingWeek = await Week.findOne({ courseId: existingCourse._id, weekNumber: week });
    // if (!existingWeek) {
    //   return res.status(404).json({ message: 'Week not found for this course' });
    // }
 
    const existingLecture = await Lecture.findOne({ course, week, lectureNumber });
    if (existingLecture) {
      return res.status(400).json({ message: 'Lecture already exists for this course, week, and lecture number' });
    }

    const newLecture = new Lecture({
      course,
      week,
      lectureNumber,
      title,
      description,
      videoUrl
    });

    const savedLecture = await newLecture.save();
    res.status(201).json(savedLecture);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lecture', error });
  }
};


exports.getLecturesByCourseAndWeek = async (req, res) => {
  try {
    const { course, week } = req.params; 

    const lectures = await Lecture.find({ course, week });

    if (lectures.length === 0) {
      return res.status(404).json({ message: `No lectures found for course ${course} in week ${week}` });
    }

    res.status(200).json(lectures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lectures', error });
  }
};
