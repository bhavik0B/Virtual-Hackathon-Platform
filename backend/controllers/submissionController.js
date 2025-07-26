// Submission controller functions placeholder
const Submission = require('../models/Submission');
const User = require('../models/User');

// Submit a new project
async function submitProject(req, res) {
  try {
    const userId = req.user.id;
    // Assume req.body contains all required fields for a submission
    const submission = await Submission.create({ ...req.body, submittedBy: userId });
    // Increment projectsCompleted for the user
    await User.findByIdAndUpdate(userId, { $inc: { projectsCompleted: 1 } });
    res.status(201).json({ message: 'Project submitted', submission });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit project', error: err.message });
  }
}

module.exports = { submitProject }; 