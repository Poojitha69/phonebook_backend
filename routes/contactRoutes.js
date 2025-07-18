const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { addContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');

router.post('/', auth, addContact);
router.get('/', auth, getContacts);
router.put('/:id', auth, updateContact);
router.delete('/:id', auth, deleteContact);

module.exports = router;
