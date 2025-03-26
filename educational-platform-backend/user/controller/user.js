const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const addUser = async (req, res) => {
  try {
    const { name, roll_no, email, role, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            message: 'Missing required fields',
            data: ""
        });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      roll_no,
      email,
      role,
      password: hashedPassword
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send a success response with the saved user data
    res.status(201).json({
      message: 'User created successfully!',
      data: savedUser
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        data: ""
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '30d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, roll_no, password } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (roll_no) updateData.roll_no = roll_no;
    
    // Handle password update separately if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: error.message
    });
  }
};

module.exports = { addUser, loginUser, updateUser };