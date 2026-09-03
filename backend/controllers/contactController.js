const mongoose = require('mongoose');
const ContactMessage = require('../models/ContactMessage');
const memoryStore = require('../config/memoryStore');

const submitContact = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name and message are required.'
      });
    }

    const docData = {
      name: name.trim(),
      phone: phone ? String(phone).trim() : '',
      email: email ? email.trim().toLowerCase() : '',
      subject: subject ? subject.trim() : 'General Enquiry',
      message: message.trim(),
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let contact = null;
    if (mongoose.connection.readyState === 1) {
      contact = await ContactMessage.create(docData);
    } else {
      docData._id = 'contact_' + Date.now();
      memoryStore.contactMessages.unshift(docData);
      contact = docData;
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting ASE APTITUDE. We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'all') filter.status = status;
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }, { subject: searchRegex }];
      }

      const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        total: messages.length,
        data: messages
      });
    }

    let list = [...memoryStore.contactMessages];
    if (status && status !== 'all') list = list.filter(m => m.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => (m.name || '').toLowerCase().includes(q) || (m.subject || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q));
    }

    res.status(200).json({
      success: true,
      total: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

const getContactMessageById = async (req, res, next) => {
  try {
    let msg = null;
    if (mongoose.connection.readyState === 1) {
      msg = await ContactMessage.findById(req.params.id);
      if (msg && msg.status === 'new') {
        msg.status = 'read';
        await msg.save();
      }
    } else {
      msg = memoryStore.contactMessages.find(m => String(m._id) === String(req.params.id));
      if (msg && msg.status === 'new') {
        msg.status = 'read';
      }
    }

    if (!msg) return res.status(404).json({ success: false, message: 'Contact message not found' });
    res.status(200).json({ success: true, data: msg });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const msg = await ContactMessage.findById(req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Contact message not found' });
      if (status) msg.status = status;
      await msg.save();
      return res.status(200).json({ success: true, message: 'Status updated successfully', data: msg });
    }

    const item = memoryStore.contactMessages.find(m => String(m._id) === String(req.params.id));
    if (!item) return res.status(404).json({ success: false, message: 'Contact message not found' });
    if (status) item.status = status;
    item.updatedAt = new Date();
    res.status(200).json({ success: true, message: 'Status updated successfully', data: item });
  } catch (error) {
    next(error);
  }
};

const deleteContactMessage = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const msg = await ContactMessage.findByIdAndDelete(req.params.id);
      if (!msg) return res.status(404).json({ success: false, message: 'Contact message not found' });
      return res.status(200).json({ success: true, message: 'Contact message deleted successfully' });
    }

    const idx = memoryStore.contactMessages.findIndex(m => String(m._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Contact message not found' });
    memoryStore.contactMessages.splice(idx, 1);
    res.status(200).json({ success: true, message: 'Contact message deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContactMessages,
  getContactMessageById,
  updateContactStatus,
  deleteContactMessage
};
