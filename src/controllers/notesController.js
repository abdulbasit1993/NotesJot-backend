const Notes = require("../models/notesModel");
const mongoose = require("mongoose");

exports.createNote = async function (req, res) {
  try {
    const { title, content } = req.body;

    const createdBy = req.user._id;

    const newNote = new Notes({
      title,
      content,
      createdBy,
    });

    const note = await newNote.save();

    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Error Creating Note",
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "Note Created Successfully",
        data: note,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllNotes = async function (req, res) {
  try {
    const userId = req.user._id;
    const notes = await Notes.find({ createdBy: userId });

    if (notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Notes Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Notes fetched successfully",
        data: notes,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleNote = async function (req, res) {
  try {
    const userId = req.user._id;

    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(404).json({
        success: false,
        message: `No Note Found with Id: ${noteId}`,
      });
    }

    const note = await Notes.findOne({ createdBy: userId, _id: noteId });

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNote = async function (req, res) {
  try {
    const noteId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(404).json({
        success: false,
        message: `No Note Found with Id: ${noteId}`,
      });
    }

    await Notes.findByIdAndDelete({ _id: noteId });

    return res.status(200).json({
      success: true,
      message: "Note Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateNote = async function (req, res) {
  try {
    const noteId = req.params.id;

    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(404).json({
        success: false,
        message: `No Note Found with Id: ${noteId}`,
      });
    }

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and Content Are Required In Order To Update The Note.",
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      { _id: noteId },
      { title, content },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Note Updated Successfully",
      data: updatedNote,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
