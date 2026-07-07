import { motion } from 'framer-motion';
import { resolveAssetUrl } from '../api/client';
import CustomAvatar from './avatar/CustomAvatar';
import { resolveAvatarConfig } from '../utils/avatarDefaults';
import { getAvatarImage, getAvatarType, isUserUploadedAvatar, normalizeUser } from '../utils/userAvatar';

export default function ProfileAvatar({
  user,
  src,
  gender,
  avatarConfig,
  size = 'md',
  showRing = true,
  floating = true,
  level,
  className = '',
  onClick,
}) {
  const normalized = user ? normalizeUser(user) : null;
  const avatarSrc = getAvatarImage(normalized) || src;
  const avatarType = normalized ? getAvatarType(normalized) : null;
  const uploaded = normalized ? isUserUploadedAvatar(normalized) : false;
  const config = normalized
    ? resolveAvatarConfig(normalized)
    : (avatarConfig || resolveAvatarConfig({ gender, avatar: avatarSrc, avatarConfig, avatarType }));

  return (
    <motion.div
      className={`profile-avatar-wrap size-${size} ${floating ? 'profile-avatar-float' : ''} ${className}`}
      whileHover={{ scale: 1.06, y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {showRing && <div className="profile-avatar-ring" aria-hidden="true" />}
      <div className="profile-avatar-inner">
        {uploaded && avatarSrc ? (
          <img src={resolveAssetUrl(avatarSrc)} alt="" className="profile-avatar-img" />
        ) : (
          <CustomAvatar config={config} />
        )}
      </div>
      {level != null && <span className="profile-avatar-level">{level}</span>}
    </motion.div>
  );
}
