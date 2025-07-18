const Contact = require('../models/Contact');

exports.addContact = async (req, res) => {
  const { name, phone } = req.body;
  const contact = new Contact({ user: req.user, name, phone });
  await contact.save();
  res.json(contact);
};

exports.getContacts = async (req, res) => {
  const { search } = req.query;
  let query = { user: req.user };
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') }
    ];
  }
  const contacts = await Contact.find(query);
  res.json(contacts);
};

exports.updateContact = async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    req.body,
    { new: true }
  );
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  await Contact.findOneAndDelete({ _id: req.params.id, user: req.user });
  res.json({ msg: 'Deleted' });
};
