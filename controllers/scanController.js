
// // ============================================
// // controllers/scanController.js
// // ============================================
// const scanService = require('../services/scanService');
// const { scanWithTextSchema, scanWithImageSchema } = require('../schemas/scanSchemas');

// exports.scanWithImage = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = scanWithImageSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ 
//         error: error.details[0].message 
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ error: 'Image file is required' });
//     }

//     const { foodName } = value;

//     // Extract ingredients from image
//     const ingredients = await scanService.extractIngredientsFromImage(
//       req.file.buffer, 
//       req.file.mimetype
//     );

//     // Analyze food safety
//     const analysis = await scanService.analyzeFoodSafety(
//       req.userId, 
//       foodName, 
//       ingredients
//     );
    
//     res.json(analysis);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.scanWithText = async (req, res) => {
//   try {
//     // Validate request body
//     const { error, value } = scanWithTextSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ 
//         error: error.details[0].message 
//       });
//     }

//     const { foodName, ingredients } = value;

//     // Analyze food safety
//     const analysis = await scanService.analyzeFoodSafety(
//       req.userId, 
//       foodName, 
//       ingredients
//     );
    
//     res.json(analysis);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getScanHistory = async (req, res) => {
//   try {
//     const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    
//     const scans = await scanService.getScanHistory(req.userId, limit);
//     res.json(scans);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getScanById = async (req, res) => {
//   try {
//     const scanId = req.params.id;
    
//     const scan = await scanService.getScanById(scanId, req.userId);
//     res.json(scan);
//   } catch (error) {
//     if (error.message === 'Scan not found') {
//       return res.status(404).json({ error: error.message });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };






const scanService = require('../services/scanService');
const { scanWithTextSchema, scanWithImageSchema } = require('../schemas/scanSchemas');

exports.scanWithImage = async (req, res) => {
  try {
    const { error, value } = scanWithImageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { foodName } = value;
    const ingredients = await scanService.extractIngredientsFromImage(
      req.file.buffer, 
      req.file.mimetype
    );

    const analysis = await scanService.analyzeFoodSafety(
      req.userId, 
      foodName, 
      ingredients
    );
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.scanWithText = async (req, res) => {
  try {
    const { error, value } = scanWithTextSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }

    const { foodName, ingredients } = value;
    const analysis = await scanService.analyzeFoodSafety(
      req.userId, 
      foodName, 
      ingredients
    );
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScanHistory = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const scans = await scanService.getScanHistory(req.userId, limit);
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScanById = async (req, res) => {
  try {
    const scanId = req.params.id;
    const scan = await scanService.getScanById(scanId, req.userId);
    res.json(scan);
  } catch (error) {
    if (error.message === 'Scan not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};