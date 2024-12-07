import DeepWork from '../models/deepworkModel.js';

// Save or Update a DeepWork entry
export const saveDeepWork = async (req, res) => {
  const { companyName, userId, Deepwork, Distraction, Unwind } = req.body;

  try {
    // Create a new entry regardless of existing data
    const newEntry = await DeepWork.create({ companyName, userId, Deepwork, Distraction, Unwind });

    res.status(201).json({ message: 'Entry created successfully', data: newEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a DeepWork entry by userId
export const getDeepWorkByUserId = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const entry = await DeepWork.find({userId:sessionId});
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all DeepWork entries
export const getAllDeepWork = async (req, res) => {
  try {
    const entries = await DeepWork.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update DeepWork entry by userId
// export const updateDeepWork = async (req, res) => {
//     const { id } = req.params; // Use MongoDB ObjectId
//     const { Deepwork, Distraction, Unwind } = req.body;
  
//     try {
//       const updatedEntry = await DeepWork.findByIdAndUpdate(
//         id,
//         { $set: { Deepwork, Distraction, Unwind } },
//         { new: true, runValidators: true }
//       );
  
//       if (!updatedEntry) {
//         return res.status(404).json({ message: 'Entry not found for the given ID' });
//       }
  
//       res.status(200).json({ message: 'Entry updated successfully', data: updatedEntry });
//     } catch (error) {
//       if (error.kind === 'ObjectId') {
//         return res.status(400).json({ message: 'Invalid ID format' });
//       }
//       res.status(500).json({ message: error.message });
//     }
//   };




export const updateDeepWork = async (req, res) => {
  const { sessionId} = req.params;
  const {userId, companyName, Deepwork, Distraction, Unwind } = req.body;

  try {
    // Validate inputs
    if (!userId || (!companyName && !Deepwork && !Distraction && !Unwind)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    // Construct update object dynamically
    const updateData = {};
    if (companyName !== undefined) updateData.companyName = companyName;
    if (Deepwork !== undefined) updateData.Deepwork = Deepwork;
    if (Distraction !== undefined) updateData.Distraction = Distraction;
    if (Unwind !== undefined) updateData.Unwind = Unwind;

    // Update the document
    const updatedEntry = await DeepWork.findByIdAndUpdate(
      sessionId,
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry updated successfully', data: updatedEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete DeepWork entry by userId
export const deleteDeepWork = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedEntry = await DeepWork.findOneAndDelete({ _id:userId });
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully', data: deletedEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
