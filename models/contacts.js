const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

const contactsPath = path.resolve('./models/contacts.json');

const setContacts = async data => fs.writeFile(contactsPath, JSON.stringify(data));

const listContacts = async () => {
  const contacts = JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
  return await contacts;
}

const getContactById = async (contactId) => {
  const contacts = listContacts();
  const contactById = contacts.find(item => contactId === item.id);
  return contactById;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const newContacts = contacts.filter(item => item.id !== contactId);
  setContacts(newContacts);
}

const addContact = async (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  const validationContacts = schema.validate(body);
  if (validationContacts.error) return false;
  console.log(validationContacts);
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), ...body };
  contacts.push(newContact);
  setContacts(contacts);
  return contacts;
}

const updateContact = async (contactId, body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.required(),
  });
  const validationContacts = schema.validate(body);
  if (validationContacts.error)
    return validationContacts.error.details[0].message;
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(item => contactId === item.id);
  if (contactIndex === -1) return false;
  const newUpdateContact = {
    ...contacts[contactIndex],
    id: contacts[contactIndex].id,
    ...body,
  };
  contacts.splice(contactIndex, 1, newUpdateContact);
  setContacts(contacts);
  return contacts;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
