import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomAvatar from './CustomAvatar';
import {
  BG_COLORS,
  HAIR_COLORS,
  SKIN_TONES,
  getDefaultConfigForGender,
} from '../../utils/avatarDefaults';

const HAIR_STYLES = {
  male: ['short', 'curly', 'bun'],
  female: ['long', 'hijab', 'curly', 'bun'],
};

const EXPRESSIONS = ['smile', 'happy', 'calm'];
const ACCESSORIES = ['none', 'glasses', 'flower'];

export default function AvatarBuilder({ gender = 'female', initialConfig, onChange }) {
  const { t } = useTranslation();
  const [config, setConfig] = useState(() => ({
    ...getDefaultConfigForGender(gender),
    ...initialConfig,
    gender,
  }));

  const update = (patch) => {
    const next = { ...config, ...patch, gender };
    setConfig(next);
    onChange?.(next);
  };

  const hairOptions = HAIR_STYLES[gender] || HAIR_STYLES.female;

  return (
    <div className="avatar-builder">
      <div className="avatar-builder-preview glass-card">
        <CustomAvatar config={config} />
      </div>

      <div className="avatar-builder-options">
        <label className="avatar-builder-label">{t('avatar.skin')}</label>
        <div className="avatar-color-row">
          {SKIN_TONES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`avatar-color-swatch ${config.skin === s.color ? 'active' : ''}`}
              style={{ background: s.color }}
              onClick={() => update({ skin: s.color })}
              aria-label={s.id}
            />
          ))}
        </div>

        <label className="avatar-builder-label">{t('avatar.hairStyle')}</label>
        <div className="avatar-chip-row">
          {hairOptions.map((h) => (
            <button
              key={h}
              type="button"
              className={`avatar-chip ${config.hair === h ? 'active' : ''}`}
              onClick={() => update({ hair: h })}
            >
              {t(`avatar.hair.${h}`)}
            </button>
          ))}
        </div>

        <label className="avatar-builder-label">{t('avatar.hairColor')}</label>
        <div className="avatar-color-row">
          {HAIR_COLORS.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`avatar-color-swatch ${config.hairColor === h.color ? 'active' : ''}`}
              style={{ background: h.color }}
              onClick={() => update({ hairColor: h.color })}
              aria-label={h.id}
            />
          ))}
        </div>

        <label className="avatar-builder-label">{t('avatar.background')}</label>
        <div className="avatar-color-row">
          {BG_COLORS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={`avatar-color-swatch ${config.bg === b.color ? 'active' : ''}`}
              style={{ background: b.color }}
              onClick={() => update({ bg: b.color })}
              aria-label={b.id}
            />
          ))}
        </div>

        <label className="avatar-builder-label">{t('avatar.expression')}</label>
        <div className="avatar-chip-row">
          {EXPRESSIONS.map((e) => (
            <button
              key={e}
              type="button"
              className={`avatar-chip ${config.expression === e ? 'active' : ''}`}
              onClick={() => update({ expression: e })}
            >
              {t(`avatar.expression.${e}`)}
            </button>
          ))}
        </div>

        <label className="avatar-builder-label">{t('avatar.accessory')}</label>
        <div className="avatar-chip-row">
          {ACCESSORIES.map((a) => (
            <button
              key={a}
              type="button"
              className={`avatar-chip ${config.accessory === a ? 'active' : ''}`}
              onClick={() => update({ accessory: a })}
            >
              {t(`avatar.accessory.${a}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
