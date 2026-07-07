import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { protect } from '../middleware/auth.js';
import {
  validateForgotPassword,
  validateGoogleAuth,
  validateLogin,
  validateRegister,
  validateResetPassword,
} from '../middleware/validateAuth.js';
import { verifyGoogleToken } from '../services/googleAuthService.js';
import { getDefaultAvatarConfig, getPresetAvatar, normalizeGender } from '../utils/defaultAvatar.js';
import { env } from '../config/env.js';

const router = express.Router();

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
function authResponse(user) {
  const token = signToken(user._id);
  return { user: user.toPublicJSON(), token };
}

router.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { name, email, password, avatarPreference, gender, avatarConfig } = req.body;
    const pref = avatarPreference || gender || 'female';

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.provider === 'google') {
        return sendError(res, 'An account with this email uses Google sign-in. Please continue with Google.', 409);
      }
      return sendError(res, 'Email already registered', 409);
    }

    let normalizedGender = 'other';
    let avatar = '';
    let config = null;

    if (pref === 'male') {
      normalizedGender = 'male';
      avatar = getPresetAvatar('male');
      config = getDefaultAvatarConfig('male');
    } else if (pref === 'female') {
      normalizedGender = 'female';
      avatar = getPresetAvatar('female');
      config = getDefaultAvatarConfig('female');
    } else if (pref === 'custom') {
      normalizedGender = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'other';
      config = avatarConfig && typeof avatarConfig === 'object'
        ? avatarConfig
        : getDefaultAvatarConfig(normalizedGender === 'male' ? 'male' : 'female');
      avatar = getPresetAvatar(normalizedGender === 'male' ? 'male' : 'female');
    } else if (pref === 'upload') {
      normalizedGender = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'other';
      avatar = '';
      config = null;
    } else {
      normalizedGender = normalizeGender(pref);
      avatar = getPresetAvatar(normalizedGender);
      config = getDefaultAvatarConfig(normalizedGender);
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: 'local',
      gender: normalizedGender,
      avatar,
      avatarType: ['male', 'female', 'custom', 'upload'].includes(pref) ? pref : 'female',
      avatarConfig: config,
    });

    sendSuccess(res, authResponse(user), 201);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (user.provider === 'google') {
      return sendError(res, 'This account uses Google sign-in. Please continue with Google.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    sendSuccess(res, authResponse(user));
  } catch (error) {
    next(error);
  }
});

router.post('/google', validateGoogleAuth, async (req, res, next) => {
  try {
    const googleUser = await verifyGoogleToken(req.body.credential);

    if (!googleUser.emailVerified) {
      return sendError(res, 'Google email is not verified', 401);
    }

    let user = await User.findOne({ googleId: googleUser.googleId });

    if (!user) {
      const existingByEmail = await User.findOne({ email: googleUser.email });

      if (existingByEmail) {
        if (existingByEmail.provider === 'local') {
          return sendError(
            res,
            'An account with this email already exists. Sign in with email and password.',
            409
          );
        }
        user = existingByEmail;
      } else {
        user = await User.create({
          name: googleUser.name,
          email: googleUser.email,
          provider: 'google',
          googleId: googleUser.googleId,
          gender: 'female',
          avatar: googleUser.avatar && googleUser.avatar.startsWith('http') ? googleUser.avatar : getPresetAvatar('female'),
          avatarConfig: getDefaultAvatarConfig('female'),
        });
      }
    }

    if (!user.googleId) {
      user.googleId = googleUser.googleId;
      user.provider = 'google';
      if (googleUser.avatar) user.avatar = googleUser.avatar;
      await user.save();
    }

    sendSuccess(res, authResponse(user));
  } catch (error) {
    if (error.message.includes('not configured')) {
      return sendError(res, error.message, 503);
    }
    next(error);
  }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    sendSuccess(res, req.user.toPublicJSON());
  } catch (error) {
    next(error);
  }
});

router.post('/logout', async (_req, res) => {
  sendSuccess(res, { message: 'Logged out successfully' });
});

router.post('/forgot-password', validateForgotPassword, async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return sendSuccess(res, {
        message: 'If an account exists for this email, a reset link has been generated.',
      });
    }

    if (user.provider === 'google') {
      return sendError(res, 'This account uses Google login.', 400);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashResetToken(resetToken);
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.frontendUrl.replace(/\/$/, '')}/reset-password/${resetToken}`;

    sendSuccess(res, {
      message: 'Password reset link generated.',
      resetUrl,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reset-password/:token', validateResetPassword, async (req, res, next) => {
  try {
    const hashedToken = hashResetToken(req.params.token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return sendError(res, 'Invalid or expired reset token', 400);
    }

    if (user.provider === 'google') {
      return sendError(res, 'This account uses Google login.', 400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendSuccess(res, { message: 'Password reset successfully. You can now sign in with your new password.' });
  } catch (error) {
    next(error);
  }
});

export default router;
