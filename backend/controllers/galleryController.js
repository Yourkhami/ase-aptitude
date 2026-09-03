const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const GalleryImage = require('../models/GalleryImage');
const memoryStore = require('../config/memoryStore');

const getActiveGallery = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const images = await GalleryImage.find({ isActive: true }).sort({ isFeatured: -1, createdAt: -1 });
      return res.status(200).json({ success: true, count: images.length, data: images });
    }

    const active = memoryStore.gallery.filter(g => g.isActive);
    res.status(200).json({ success: true, count: active.length, data: active });
  } catch (error) {
    next(error);
  }
};

const getAllGallery = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const images = await GalleryImage.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: images.length, data: images });
    }

    res.status(200).json({ success: true, count: memoryStore.gallery.length, data: memoryStore.gallery });
  } catch (error) {
    next(error);
  }
};

const uploadGalleryImage = async (req, res, next) => {
  try {
    const { title, description, category, isFeatured, isActive } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ success: false, message: 'Please upload an image file or provide an imageUrl.' });
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Image title is required.' });
    }

    const doc = {
      title: title.trim(),
      description: description ? description.trim() : '',
      imageUrl,
      category: category || 'building',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive: isActive === undefined || isActive === 'true' || isActive === true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let image = null;
    if (mongoose.connection.readyState === 1) {
      image = await GalleryImage.create(doc);
    } else {
      doc._id = 'gallery_' + Date.now();
      memoryStore.gallery.unshift(doc);
      image = doc;
    }

    res.status(201).json({ success: true, message: 'Gallery image uploaded successfully', data: image });
  } catch (error) {
    next(error);
  }
};

const updateGalleryImage = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (mongoose.connection.readyState === 1) {
      const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!image) return res.status(404).json({ success: false, message: 'Gallery image not found' });
      return res.status(200).json({ success: true, message: 'Gallery image updated successfully', data: image });
    }

    const idx = memoryStore.gallery.findIndex(g => String(g._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Gallery image not found' });

    memoryStore.gallery[idx] = { ...memoryStore.gallery[idx], ...req.body, updatedAt: new Date() };
    res.status(200).json({ success: true, message: 'Gallery image updated successfully', data: memoryStore.gallery[idx] });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryImage = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const image = await GalleryImage.findById(req.params.id);
      if (!image) return res.status(404).json({ success: false, message: 'Gallery image not found' });

      if (image.imageUrl && image.imageUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', image.imageUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }

      await GalleryImage.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
    }

    const idx = memoryStore.gallery.findIndex(g => String(g._id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ success: false, message: 'Gallery image not found' });
    memoryStore.gallery.splice(idx, 1);
    res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActiveGallery, getAllGallery, uploadGalleryImage, updateGalleryImage, deleteGalleryImage };
