const mongoose = require('mongoose');
const Enrollment = require('../user/model/enrollment');

const createEnrollments = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://root:root@clustersolnstech.1bikubl.mongodb.net/educationaPlatformIITM?retryWrites=true&w=majority&appName=ClusterSolnstech');
        console.log('Connected to MongoDB');

        // User and Course IDs from your data
        const userId = "67dc54ca6f3671ca32c6e452";
        const courseIds = [
            "67daa3763295e7e667a5ea6b",  // Test Course
            "67dc543933038a94558d676b"   // Test Course 2
        ];

        // Create enrollment entries
        const enrollments = await Promise.all(courseIds.map(async (courseId) => {
            const enrollment = new Enrollment({
                user_id: userId,
                course_id: courseId,
                enrolled_at: new Date()
            });
            return enrollment.save();
        }));

        console.log('Enrollments created successfully:', enrollments);

    } catch (error) {
        console.error('Error creating enrollments:', error.message);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

// Run the script
createEnrollments(); 