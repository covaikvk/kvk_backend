const express = require('express');
const router = express.Router();
const quotationsController = require('./quotationsController');

// Add a new quotation
router.post('/', quotationsController.addQuotation);

// Get all quotations
router.get('/', quotationsController.getAllQuotations);

// Get a single quotation by id
router.get('/:id', quotationsController.getQuotationById);

// Update a quotation
router.put('/:id', quotationsController.updateQuotation);

// Delete a quotation
router.delete('/:id', quotationsController.deleteQuotation);

module.exports = router;
