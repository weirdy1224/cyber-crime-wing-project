const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const generateReferenceNumber = () => 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();

router.post('/submit', auth, upload.array('documents', 5), (req, res) => {
  console.log('Request body:', req.body);
  console.log('Files:', req.files);
  const {
    name, mobile, email, address, account_type, account_ownership, account_number,
    ncrp_ack_number, account_opening_year, business_description, transaction_reason, id_proof_type
  } = req.body;
  const reference_number = generateReferenceNumber();
  const document_paths = req.files ? req.files.map(file => file.path).join(',') : '';
  const user_id = req.user.id; // Ensure this is set by auth middleware

  db.run(
    `INSERT INTO requests (reference_number, user_id, name, mobile, email, address, account_type, account_ownership,
      account_number, ncrp_ack_number, account_opening_year, business_description, transaction_reason,
      id_proof_type, document_paths) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [reference_number, user_id || null, name, mobile, email, address, account_type, account_ownership, account_number,
      ncrp_ack_number, account_opening_year, business_description, transaction_reason, id_proof_type, document_paths],
    function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ message: 'Error submitting request' });
      }
      console.log(`Email sent to ${email} with reference number: ${reference_number}`);
      res.json({ reference_number, message: 'Request submitted successfully' });
    }
  );
});

module.exports = router;