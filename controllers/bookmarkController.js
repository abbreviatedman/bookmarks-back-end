const express = require("express");
const bookmarks = express.Router();
const {
  getAllBookmarks,
  getBookmark,
  createBookmark,
  deleteBookmark,
  updateBookmark,
} = require("../queries/bookmarks");
const { checkName, checkBoolean } = require("../validations/checkBookmarks");

// INDEX
bookmarks.get("/", async (req, res) => {
  const allBookmarks = await getAllBookmarks();
  if (allBookmarks[0]) {
    res.status(200).json(allBookmarks);
  } else {
    res.status(500).json({ error: "server error" });
  }
});

// SHOW
bookmarks.get("/:id", async (req, res) => {
  const { id } = req.params;
  const bookmark = await getBookmark(id);
  if (bookmark) {
    res.json(bookmark);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

// CREATE

bookmarks.post("/", checkBoolean, checkName, async (req, res) => {
  try {
    const bookmark = await createBookmark(req.body);
    res.json(bookmark);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// DELETE
bookmarks.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedBookmark = await deleteBookmark(id);
  // If there is an error and object is returned which is truthy. Therefore we used .id to check that the deletedBookmark variable holds the keys and volume we want.

  // since we used the "one" sql method, which returns an object, if the call to the database is successful we can use dot notation in our conditional for error handling
  // If we used dot "any", which returns multiple rows of data in an array, when the call to the database is successful we CANNOT use dot notation
  if (deletedBookmark.id) {
    res.status(200).json(deletedBookmark);
  } else {
    res.status(404).json("Bookmark not found");
  }
});

// UPDATE
bookmarks.put("/:id", checkBoolean, checkName, async (req, res) => {
  const updatedBookmark = await updateBookmark(req.params.id, req.body);
  // If there is an error and object is returned which is truthy. Therefore we used .id to check that the updatedBookmark variable holds the keys and volume we want.

  // since we used the "one" sql method, which returns an object, if the call to the database is successful we can use dot notation in our conditional for error handling
  if (updatedBookmark.id) {
    res.status(200).json(updatedBookmark);
  } else {
    res.status(404).json("Bookmark does not exist");
  }
});

module.exports = bookmarks;
