// middlewares/passwordValidator.js
export const validatePasswordStrength = (req, res, next) => {
  const { password } = req.body;

  // Min 8 caractères, au moins 1 majuscule, 1 minuscule, 1 chiffre
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!regex.test(password)) {
    return res.status(400).json({
      message: 'Le mot de passe doit contenir au moins 8 caractères, avec majuscules, minuscules et chiffres.'
    });
  }

  next();
};
