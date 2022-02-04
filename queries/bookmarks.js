// const bookmarks = require("../controllers/bookmarkController");
const db = require("../db/dbConfig");

const getAllBookmarks = async () => {
  try {
    const allBookmarks = await db.any("SELECT * FROM bookmarks");
    // console.log(allBookmarks);
    return allBookmarks;
  } catch (error) {
    return error;
  }
};

const getBookmark = async (id) => {
  try {
    const oneBookmark = await db.one("SELECT * FROM bookmarks WHERE id=$1", id);
    return oneBookmark;
  } catch (error) {
    return error;
  }
};

const createBookmark = async (bookmark) => {
  try {
    const newBookmark = await db.one(
      "INSERT INTO bookmarks (name, url, category, is_favorite) VALUES($1, $2, $3, $4) RETURNING *",
      [bookmark.name, bookmark.url, bookmark.category, bookmark.is_favorite]
    );
    // console.log(newBookmark);
    return newBookmark;
  } catch (error) {
    return error;
  }
};

const deleteBookmark = async (id) => {
  try {
    // Use SQL Method one because we only want to delete the one bookmark. If there is an error the request will not resolve
    // If we only have one index variable we do not need an array
    const deletedBookmark = await db.one(
      "DELETE FROM bookmarks WHERE id = $1 RETURNING *",
      id
    );
    return deletedBookmark;
  } catch (error) {
    return error;
  }
};

const updateBookmark = async (id, bookmark) => {
  try {
    const { name, url, category, is_favorite } = bookmark;
    // Use SQL Method one because we only want to update the one bookmark. If there is an error the request will not resolve
    // Use an array for the second argument because there are multiple index variables
    // With PG-Promise the index starts at $1
    // The variables in the array must correspond to the index you stated in the query.
    const changedBookmark = await db.one(
      "UPDATE bookmarks SET name=$1, URL=$2, category=$3, is_favorite=$4 WHERE id=$5 RETURNING *",
      [name, url, category, is_favorite, id]
    );
    return changedBookmark;
  } catch (error) {
    return error;
  }
};

// Documentation https://www.npmjs.com/package/pg-promise#documentation

module.exports = {
  getAllBookmarks,
  getBookmark,
  createBookmark,
  deleteBookmark,
  updateBookmark,
};
