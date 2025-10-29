const { body, param } = require('express-validator');

// Validaciones para usuarios
const validateUser = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('El nombre debe tener entre 2 y 60 caracteres')
    .matches(/^[a-zA-Z√√©√≠√≥√∫√Å√â√√√ö√√\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('email')
    .isEmail()
    .withMessage('Debe ser un email v√lido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('El email no puede tener m√s de 100 caracteres'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('La contrase√a debe tener al menos 8 caracteres')
    .matches(/\d/)
    .withMessage('La contrase√a debe contener al menos un n√∫mero')
    .matches(/[a-zA-Z]/)
    .withMessage('La contrase√a debe contener al menos una letra')
];

// Validaciones para actualizar usuarios (campos opcionales)
const validateUserUpdate = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('El nombre debe tener entre 2 y 60 caracteres')
    .matches(/^[a-zA-Z√√©√≠√≥√∫√Å√â√√√ö√√\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un email v√lido')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('El email no puede tener m√s de 100 caracteres'),

  body('password')
    .optional({ checkFalsy: true })
    .custom((value) => {
      // Si no hay valor o es una cadena vac√≠a, es v√lido (opcional)
      if (!value || value === '' || value.trim() === '') {
        return true;
      }
      // Si hay valor, validar que cumpla los requisitos
      if (value.length < 8) {
        throw new Error('La contrase√a debe tener al menos 8 caracteres');
      }
      if (!/\d/.test(value)) {
        throw new Error('La contrase√a debe contener al menos un n√∫mero');
      }
      if (!/[a-zA-Z]/.test(value)) {
        throw new Error('La contrase√a debe contener al menos una letra');
      }
      return true;
    })
];

// Validaciones para pedidos
const validateOrder = [
  body('usuario_id')
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un n√∫mero entero positivo'),

  body('producto')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El producto debe tener entre 1 y 100 caracteres')
    .notEmpty()
    .withMessage('El producto es requerido'),

  body('cantidad')
    .isInt({ min: 1, max: 100 })
    .withMessage('La cantidad debe ser un n√∫mero entero entre 1 y 100'),

  body('precio_unitario')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio unitario debe ser un n√∫mero positivo')
];

// Validaciones para actualizar pedidos
const validateOrderUpdate = [
  body('producto')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El producto debe tener entre 1 y 100 caracteres'),

  body('cantidad')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La cantidad debe ser un n√∫mero entero entre 1 y 100'),

  body('precio_unitario')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio unitario debe ser un n√∫mero positivo'),

  body('estado')
    .optional()
    .isIn(['pendiente', 'confirmado', 'en_proceso', 'enviado', 'entregado', 'cancelado'])
    .withMessage('Estado no v√lido')
];

// Validaciones para par√metros de ruta
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un n√∫mero entero positivo')
];

module.exports = {
  validateUser,
  validateUserUpdate,
  validateOrder,
  validateOrderUpdate,
  validateId
};
