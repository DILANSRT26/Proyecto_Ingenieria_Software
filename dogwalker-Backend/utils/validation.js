// utils/validation.js - Esquemas de validación con Joi
const Joi = require('joi');

// Validación para registro de usuario
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es obligatorio'
      }),
    
    password: Joi.string()
      .min(6)
      .max(50)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede tener más de 50 caracteres',
        'any.required': 'La contraseña es obligatoria'
      }),
    
    firstName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 30 caracteres',
        'any.required': 'El nombre es obligatorio'
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(30)
      .required()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 30 caracteres',
        'any.required': 'El apellido es obligatorio'
      }),
    
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .min(8)
      .max(20)
      .optional()
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres permitidos (+, -, espacios, paréntesis)',
        'string.min': 'El teléfono debe tener al menos 8 caracteres',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    
    userType: Joi.string()
      .valid('OWNER', 'WALKER')
      .required()
      .messages({
        'any.only': 'El tipo de usuario debe ser OWNER o WALKER',
        'any.required': 'El tipo de usuario es obligatorio'
      }),
    
    address: Joi.string()
      .min(5)
      .max(200)
      .optional()
      .messages({
        'string.min': 'La dirección debe tener al menos 5 caracteres',
        'string.max': 'La dirección no puede tener más de 200 caracteres'
      }),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .messages({
        'string.min': 'La ciudad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 50 caracteres'
      }),
    
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .optional()
      .messages({
        'number.min': 'La latitud debe estar entre -90 y 90',
        'number.max': 'La latitud debe estar entre -90 y 90'
      }),
    
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .optional()
      .messages({
        'number.min': 'La longitud debe estar entre -180 y 180',
        'number.max': 'La longitud debe estar entre -180 y 180'
      }),
    
    // Campos específicos para paseadores
    description: Joi.string()
      .min(10)
      .max(500)
      .optional()
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede tener más de 500 caracteres'
      }),
    
    experience: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .optional()
      .messages({
        'number.integer': 'La experiencia debe ser un número entero',
        'number.min': 'La experiencia no puede ser negativa',
        'number.max': 'La experiencia no puede ser mayor a 50 años'
      }),
    
    hourlyRate: Joi.number()
      .positive()
      .precision(2)
      .max(1000)
      .optional()
      .messages({
        'number.positive': 'La tarifa por hora debe ser un número positivo',
        'number.max': 'La tarifa por hora no puede ser mayor a 1000'
      })
  });

  return schema.validate(data);
};

// Validación para login
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Debe ser un email válido',
        'any.required': 'El email es obligatorio'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es obligatoria'
      })
  });

  return schema.validate(data);
};

// Validación para actualización de perfil
const profileValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(30)
      .optional()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 30 caracteres'
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(30)
      .optional()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 30 caracteres'
      }),
    
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .min(8)
      .max(20)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres permitidos',
        'string.min': 'El teléfono debe tener al menos 8 caracteres',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    
    address: Joi.string()
      .min(5)
      .max(200)
      .optional()
      .allow('')
      .messages({
        'string.min': 'La dirección debe tener al menos 5 caracteres',
        'string.max': 'La dirección no puede tener más de 200 caracteres'
      }),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .allow('')
      .messages({
        'string.min': 'La ciudad debe tener al menos 2 caracteres',
        'string.max': 'La ciudad no puede tener más de 50 caracteres'
      }),
    
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .optional()
      .allow(null)
      .messages({
        'number.min': 'La latitud debe estar entre -90 y 90',
        'number.max': 'La latitud debe estar entre -90 y 90'
      }),
    
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .optional()
      .allow(null)
      .messages({
        'number.min': 'La longitud debe estar entre -180 y 180',
        'number.max': 'La longitud debe estar entre -180 y 180'
      }),
    
    description: Joi.string()
      .min(10)
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.min': 'La descripción debe tener al menos 10 caracteres',
        'string.max': 'La descripción no puede tener más de 500 caracteres'
      }),
    
    experience: Joi.number()
      .integer()
      .min(0)
      .max(50)
      .optional()
      .allow(null)
      .messages({
        'number.integer': 'La experiencia debe ser un número entero',
        'number.min': 'La experiencia no puede ser negativa',
        'number.max': 'La experiencia no puede ser mayor a 50 años'
      }),
    
    hourlyRate: Joi.number()
      .positive()
      .precision(2)
      .max(1000)
      .optional()
      .allow(null)
      .messages({
        'number.positive': 'La tarifa por hora debe ser un número positivo',
        'number.max': 'La tarifa por hora no puede ser mayor a 1000'
      })
  });

  return schema.validate(data);
};

// Validación para crear/actualizar perro
const dogValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'El nombre del perro es obligatorio',
        'string.max': 'El nombre no puede tener más de 50 caracteres',
        'any.required': 'El nombre del perro es obligatorio'
      }),
    
    breed: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'La raza debe tener al menos 2 caracteres',
        'string.max': 'La raza no puede tener más de 50 caracteres',
        'any.required': 'La raza es obligatoria'
      }),
    
    age: Joi.number()
      .integer()
      .min(0)
      .max(30)
      .required()
      .messages({
        'number.integer': 'La edad debe ser un número entero',
        'number.min': 'La edad no puede ser negativa',
        'number.max': 'La edad no puede ser mayor a 30 años',
        'any.required': 'La edad es obligatoria'
      }),
    
    weight: Joi.number()
      .positive()
      .max(150)
      .required()
      .messages({
        'number.positive': 'El peso debe ser un número positivo',
        'number.max': 'El peso no puede ser mayor a 150 kg',
        'any.required': 'El peso es obligatorio'
      }),
    
    size: Joi.string()
      .valid('small', 'medium', 'large')
      .required()
      .messages({
        'any.only': 'El tamaño debe ser small, medium o large',
        'any.required': 'El tamaño es obligatorio'
      }),
    
    description: Joi.string()
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede tener más de 500 caracteres'
      }),
    
    isAggressive: Joi.boolean()
      .optional()
      .default(false),
    
    needsLeash: Joi.boolean()
      .optional()
      .default(true),
    
    specialNeeds: Joi.string()
      .max(300)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Las necesidades especiales no pueden tener más de 300 caracteres'
      }),
    
    medicalNotes: Joi.string()
      .max(300)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Las notas médicas no pueden tener más de 300 caracteres'
      })
  });

  return schema.validate(data);
};

// Validación para servicios de paseo
const serviceValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.min': 'El título debe tener al menos 5 caracteres',
        'string.max': 'El título no puede tener más de 100 caracteres',
        'any.required': 'El título es obligatorio'
      }),
    
    description: Joi.string()
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La descripción no puede tener más de 500 caracteres'
      }),
    
    scheduledDate: Joi.date()
      .min('now')
      .required()
      .messages({
        'date.min': 'La fecha debe ser futura',
        'any.required': 'La fecha programada es obligatoria'
      }),
    
    duration: Joi.number()
      .integer()
      .min(15)
      .max(480)
      .required()
      .messages({
        'number.integer': 'La duración debe ser un número entero',
        'number.min': 'La duración mínima es 15 minutos',
        'number.max': 'La duración máxima es 8 horas (480 minutos)',
        'any.required': 'La duración es obligatoria'
      }),
    
    pickupAddress: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'La dirección de recogida debe tener al menos 5 caracteres',
        'string.max': 'La dirección de recogida no puede tener más de 200 caracteres',
        'any.required': 'La dirección de recogida es obligatoria'
      }),
    
    returnAddress: Joi.string()
      .min(5)
      .max(200)
      .optional()
      .allow('')
      .messages({
        'string.min': 'La dirección de regreso debe tener al menos 5 caracteres',
        'string.max': 'La dirección de regreso no puede tener más de 200 caracteres'
      }),
    
    price: Joi.number()
      .positive()
      .precision(2)
      .max(10000)
      .optional()
      .messages({
        'number.positive': 'El precio debe ser un número positivo',
        'number.max': 'El precio no puede ser mayor a 10,000'
      }),
    
    dogId: Joi.string()
      .required()
      .messages({
        'any.required': 'Debe seleccionar un perro'
      })
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  dogValidation,
  serviceValidation
};