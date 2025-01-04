const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
const { createToken } = require('../controllers/jwtController.js');
const createError = require('http-errors');

// Register Endpoint
exports.signup = async (req, res, next) => {
    try {
        const { nume, prenume, gen, email, adresa, parola, rol} = req.body;

        if (!email || !parola || !rol) {
            return next(new createError(400, "Toate campurile sunt necesare!"));
        }

        if (rol !== 'membru' && rol !== 'bibliotecar') {
            return next(new createError(400, "Rol Invalid! Alegeti 'membru' sau 'bibliotecar'."));
        }

        const tableName = rol === 'membru' ? 'TabelaMembrii' : 'TabelaBibliotecari';

        // Check if user already exists
        const userExistsQuery = `SELECT * FROM ${tableName} WHERE email = ?`;
        const [existingUser] = await db.promise().query(userExistsQuery, [email]);

        if (existingUser.length > 0) {
            return next(new createError(400, "Utilizatorul exista deja!"));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(parola, 12);

        // Insert new user
        const insertUserQuery = `INSERT INTO ${tableName} SET ?`;
        const newUserDetails = { nume, prenume, gen, email, adresa, parola: hashedPassword };
        await db.promise().query(insertUserQuery, newUserDetails);

        // Create a JWT token
        const token = createToken({ email, rol });

        // Set the token as a cookie
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
        });

        res.status(201).json({
            status: 'success',
            message: `${rol === 'membru' ? 'Membru' : 'Bibliotecar'} registered successfully.`,
            token,
            user: { nume, prenume, gen, email, adresa, parola},
        });
    } catch (error) {
        next(error);
    }
};

// Login Endpoint
exports.login = async (req, res, next) => {
    try {
        const { email, parola } = req.body;

        if (!email || !parola) {
            return next(new createError(400, "Email si parola sunt necesare!"));
        }

        // Query both tables for the email
        const queryMembru = "SELECT * FROM TabelaMembrii WHERE email = ?";
        const queryBibliotecar = "SELECT * FROM TabelaBibliotecari WHERE email = ?";

        const [resultsMembru] = await db.promise().query(queryMembru, [email]);
        const [resultsBibliotecar] = await db.promise().query(queryBibliotecar, [email]);

        let user = null;
        let role = null;

        if (resultsMembru.length > 0) {
            user = resultsMembru[0];
            role = 'membru';
        } else if (resultsBibliotecar.length > 0) {
            user = resultsBibliotecar[0];
            role = 'bibliotecar';
        } else {
            return next(new createError(404, "Email sau parola invalide!"));
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(parola, user.parola);
        if (!isMatch) {
            return next(new createError(401, "Email sau parola invalide!"));
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                nume: user.nume,
                email: user.email,
                role,
            },
        });
    } catch (error) {
        next(error);
    }
}

