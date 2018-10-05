const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    hashedId: { type: String },
    userPicture: {
      type: String
    },
    isActive: { type: Boolean, require: true },
    firstName: {
      type: String,
      required: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024
    },
    expire_at: { type: Date, default: Date.now, expires: 43200 }
  },
  {
    timestamps: true
  }
);

userSchema.methods.genToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePicture: this.profilePicture
    },
    process.env.SECRET_KEY_GEN_TOKEN
  );
};

const validateSignIn = user => {
  const schema = {
    email: joi
      .string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: joi
      .string()
      .min(3)
      .max(1024)
      .required()
  };

  return joi.validate(user, schema);
};

const validatePasswordRecovery = password => {
  const schema = {
    new: joi
      .string()
      .min(3)
      .max(1024)
      .required(),
    confirmNew: joi
      .string()
      .min(3)
      .max(1024)
      .required(),
    hashedId: joi.string().required()
  };
  return joi.validate(password, schema);
};
const validateNewPassword = password => {
  const schema = {
    old: joi.string(),
    new: joi
      .string()
      .min(3)
      .max(1024)
      .required()
  };
  return joi.validate(password, schema);
};

const validateAccountRecovery = email => {
  const schema = {
    email: joi
      .string()
      .min(5)
      .max(255)
      .email()
      .required()
  };

  return joi.validate(email, schema);
};
const validateSignUp = user => {
  const userSchema = {
    displayName: joi
      .string()
      .min(5)
      .max(50)
      .required(),
    userPicture: joi.string(),
    firstName: joi
      .string()
      .max(50)
      .required(),
    lastName: joi
      .string()
      .min(5)
      .max(50)
      .required(),
    email: joi
      .string()
      .email()
      .min(5)
      .max(255)
      .required(),
    password: joi
      .string()
      .min(3)
      .max(1024)
      .required()
  };
  return joi.validate(user, userSchema);
};

exports.validatePasswordRecovery = validatePasswordRecovery;
exports.validateAccountRecoveryEmail = validateAccountRecovery;
exports.validateNewPassword = validateNewPassword;
exports.signUpValidation = validateSignUp;
exports.signInValidation = validateSignIn;
exports.User = mongoose.model("User", userSchema);
