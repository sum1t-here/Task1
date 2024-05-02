import { z } from 'zod';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { fromError } from 'zod-validation-error';
import { errorHandler } from '../utils/errorhandler.js';
import jwt from 'jsonwebtoken';

// zod schema for registration
const regSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * @REGISTRATION
 * @ROUTE @POST {{url}}/api/auth
 * @access PUBLIC
 */

export const registration = async (req, res, next) => {
  try {
    const validatedData = regSchema.parse(req.body);

    const { username, email, password } = validatedData;

    const hashedPassword = bcrypt.hashSync(password, 10);

    // create the user
    const newUser = new User({ username, email, password: hashedPassword });
    console.log(newUser);
    // save the user
    await newUser.save();

    res.status(200).json({
      success: true,
      message: 'user created successfully',
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromError(err);
      return next(errorHandler(400, validationError.toString()));
    } else {
      return next(err);
    }
  }
};

const loginSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

/**
 * @LOGNIN
 * @ROUTE @POST {{url}}/api/auth
 * @access PUBLIC
 */

export const login = async (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);

    // Find user by username
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    // Compare passwords
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Wrong Credentials'));
    }
    // Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Omit password field from response
    const { password: pass, ...userData } = validUser._doc;

    // Set JWT token in cookie and send user data in response
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ userData, message: 'user logged in successfully' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationError = fromError(err);
      return next(errorHandler(400, validationError.toString()));
    } else {
      return next(err);
    }
  }
};
