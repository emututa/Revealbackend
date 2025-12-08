



// const authService = require('../services/authService');
// const { registerSchema, loginSchema } = require('../schemas/authSchemas');

// exports.register = async (req, res) => {
//   try {
//     const { error, value } = registerSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ 
//         error: error.details[0].message 
//       });
//     }

//     const { name, email, password } = value;
//     const result = await authService.register(name, email, password);

//     res.status(201).json(result);
//   } catch (error) {
//     if (error.message === 'Email already registered') {
//       return res.status(400).json({ error: error.message });
//     }
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { error, value } = loginSchema.validate(req.body);
//     if (error) {
//       return res.status(400).json({ 
//         error: error.details[0].message 
//       });
//     }

//     const { email, password } = value;
//     const result = await authService.login(email, password);

//     res.json(result);
//   } catch (error) {
//     if (error.message === 'Invalid credentials') {
//       return res.status(401).json({ error: error.message });
//     }
//     res.status(500).json({ error: error.message });
//   }
// }





const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

exports.register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, email, password } = value;
    const result = await authService.register(name, email, password);

    return res.status(201).json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);

    const status =
      error.message === "Email already registered" ? 400 : 500;

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;
    const result = await authService.login(email, password);

    return res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);

    const status =
      error.message === "Invalid credentials" ? 401 : 500;

    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
};
