// controllers/companyController.js
import Company from '../models/Company.js';

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({
            message: "Company registered successfully!",
            company,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "A company with this email already exists.",
            });
        }
        res.status(500).json({
            message: error.message || "An error occurred while registering the company.",
        });
    }
};

// Get all company names
export const getAllCompanyNames = async (req, res) => {
    try {
        const companies = await Company.find({}, 'name'); // Only select the 'name' field
        res.status(200).json({
            message: "Company names retrieved successfully!",
            companyNames: companies.map(company => company.name), // Extract names
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while retrieving company names.",
        });
    }
};
