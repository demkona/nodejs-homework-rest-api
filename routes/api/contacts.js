const express = require('express');
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts.js');
const router = express.Router();
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
  try {
    const getListContacts = await listContacts();
    return res.status(200).json(getListContacts);
  } catch (err) {
    next(createError(err));
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const getContactId = await getContactById(req.params.contactId);
    if (!getContactId) throw new Error();
    return res.json(getContactId);
  } catch (err) {
    return res.status(404).json({ massage: 'Not found' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newContact = await addContact(req.body);
    if (!newContact) throw new Error();
    return res.status(201).json(newContact);
  } catch (err) {
    return res.status(400).json({ message: 'missing required name field' });
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const deleteContact = await removeContact(
      await req.params.contactId,
    );
    if (!deleteContact) throw new Error();
    res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    return res.status(404).json({ massage: 'Not found' });
  }
});

router.patch('/:contactId', async (req, res, next) => {
  try {
    const newUpdateContact = await updateContact(
      req.params.contactId,
      req.body,
    );
    if (!newUpdateContact) throw new Error();
    if (typeof newUpdateContact === 'string') {
      return res.status(400).json({ message: newUpdateContact });
    }
    res.status(200).json(newUpdateContact);
  } catch (err) {
    return res.status(404).json({ message: 'Not found' });
  }
});

module.exports = router;