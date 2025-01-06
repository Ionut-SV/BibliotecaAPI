const db = require('../config/db');

// Execute a query with parameters
const executeQuery = (query, params) =>
    new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });

// Begin a transaction
const beginTransaction = () =>
    new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) return reject(err);
            connection.beginTransaction((err) => {
                if (err) {
                    connection.release();
                    return reject(err);
                }
                resolve(connection);
            });
        });
    });

// Commit a transaction
const commitTransaction = (connection) =>
    new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) {
                connection.rollback(() => connection.release());
                return reject(err);
            }
            connection.release();
            resolve();
        });
    });

// Rollback a transaction
const rollbackTransaction = (connection, err) =>
    new Promise(() => {
        connection.rollback(() => connection.release());
        throw err;
    });

module.exports = {
    executeQuery,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
};