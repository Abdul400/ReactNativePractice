import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { useEffect } from "react";

//exporting the db file
const dbDir = FileSystem.documentDirectory + "SQLite";
const dbPath = dbDir + "myTasks.db";

// Create table
const createTable = async () => {
  const db = await SQLite.openDatabaseAsync("myTasks.db");
  try {
    console.log("creating table...");
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          description TEXT,
          completed INTEGER DEFAULT 0 CHECK(completed IN (0,1)),
          date TEXT,
          startTime TEXT,
          endTime TEXT
        );
    `);
    console.log("table created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

// // Export the database file
// const exportDatabase = async () => {
//   try {
//     // Ensure the directory exists
//     await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });

//     // Get the database file URI
//     const dbFileUri = await SQLite.openDatabaseAsync("myTasks.db").uri;

//     // Copy the database file to the new location
//     await FileSystem.copyAsync({
//       from: dbFileUri,
//       to: dbPath,
//     });

//     console.log("Database exported to:", dbPath);
//   } catch (error) {
//     console.error("Error exporting database:", error);
//   }
// };

// Create item
const createItem = async (task) => {
  if (!task || typeof task !== "object") {
    console.error("Invalid task object");
    return;
  }

  try {
    const db = await SQLite.openDatabaseAsync("myTasks.db", {
      useNewConnection: true,
    });
    if (!db) {
      throw new Error("Failed to open database");
    }

    const {
      title = "",
      description = "",
      completed = 0,
      date = null,
      startTime = null,
      endTime = null,
    } = task;

    console.log("56", "createItem", task);
    console.log(
      "in create items",
      title,
      description,
      completed,
      date,
      startTime,
      endTime
    );

    await db.runAsync(
      `INSERT INTO tasks (title, description, completed, date, startTime, endTime) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, completed, date, startTime, endTime]
    );
    console.log("item created successfully");
  } catch (error) {
    console.error("Error creating item:", error);
  }
};

//Read items
const readItems = async () => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    const result = await db.getAllAsync("SELECT * FROM tasks;");
    return result;
  } catch (error) {
    console.error("Error reading items:", error);
  }
};

// Update item
const updateItem = async (id) => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    await db.runAsync(`UPDATE tasks SET completed = 1 WHERE id = ?;`, [id]);
    console.log("Item updated successfully");
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

// Delete item
const deleteItem = async (id) => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    await db.runAsync("DELETE FROM tasks WHERE id = ?;", [id]);
    console.log("Item deleted successfully");
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};

// Clear database
const clearDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    console.log("clearing database...");
    await db.execAsync("DROP TABLE IF EXISTS tasks;");
    await createTable(); // Recreate the table after dropping it
    console.log("database cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};

const clearCompleted = async () => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    await db.runAsync("DELETE FROM tasks WHERE completed = 1;");
    console.log("Completed tasks cleared successfully");
  } catch (error) {
    console.error("Error clearing completed tasks:", error);
  }
};

const changeTodoStatusToCurrentInDb = async (id) => {
  const db = await SQLite.openDatabaseAsync("myTasks.db", {
    useNewConnection: true,
  });
  try {
    await db.runAsync("UPDATE tasks SET completed = 0 WHERE id = ?;", [id]);
    console.log("Todo status changed to current successfully");
  } catch (error) {
    console.error("Error changing todo status to current:", error);
  }
};
// Initialize database
// createTable();
// readItems();
// clearDatabase();
// // {
//   "cli": {
//     "version": ">= 12.5.2",
//     "appVersionSource": "remote"
//   },
//   "build": {
//     "development": {
//       "developmentClient": true,
//       "distribution": "internal"
//     },
//     "preview": {
//       "distribution": "internal"
//     },
//     "production": {
//       "autoIncrement": true
//     }
//   },
//   "submit": {
//     "production": {}
//   }
// }

export {
  createItem,
  updateItem,
  deleteItem,
  readItems,
  clearDatabase,
  clearCompleted,
  changeTodoStatusToCurrentInDb,
  createTable,
};
