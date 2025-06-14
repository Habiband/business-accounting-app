import Joi from 'joi';
import { schemas } from '@/utils/validation';

export const authValidation = {
  register: Joi.object({
    email: schemas.email,
    password: schemas.password,
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  }),

  login: Joi.object({
    email: schemas.email,
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: schemas.email,
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: schemas.password,
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: schemas.password,
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).optional(),
  }),
};
