import { z } from 'zod';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { fromError } from 'zod-validation-error';
import { errorHandler } from '../utils/errorhandler.js';

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
