import TimeCapsule from '../../models/TimeCapsule.js';

export async function createCapsule(userId, { title, message, unlockDate }) {
  const unlock = new Date(unlockDate);
  if (unlock <= new Date()) throw new Error('Unlock date must be in the future');

  return TimeCapsule.create({
    user: userId,
    title: title || 'Letter to Future Me',
    message,
    unlockDate: unlock,
    locked: true,
  });
}

export async function listCapsules(userId) {
  const capsules = await TimeCapsule.find({ user: userId }).sort({ unlockDate: 1 }).lean();
  const now = new Date();

  return capsules.map((c) => {
    const canOpen = now >= new Date(c.unlockDate);
    const daysLeft = Math.ceil((new Date(c.unlockDate) - now) / 86400000);
    return {
      _id: c._id,
      title: c.title,
      unlockDate: c.unlockDate,
      locked: c.locked && !canOpen,
      canOpen: canOpen && c.locked,
      daysLeft: canOpen ? 0 : Math.max(0, daysLeft),
      openedAt: c.openedAt,
      preview: c.openedAt ? c.message : null,
    };
  });
}

export async function openCapsule(userId, capsuleId) {
  const capsule = await TimeCapsule.findOne({ _id: capsuleId, user: userId });
  if (!capsule) throw new Error('Capsule not found');

  const now = new Date();
  if (now < new Date(capsule.unlockDate)) throw new Error('This capsule is still locked');

  capsule.locked = false;
  capsule.openedAt = now;
  await capsule.save();

  return capsule;
}

export async function deleteCapsule(userId, capsuleId) {
  return TimeCapsule.findOneAndDelete({ _id: capsuleId, user: userId });
}
