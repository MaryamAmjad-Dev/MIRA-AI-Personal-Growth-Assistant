import AvatarBuilder from './AvatarBuilder';

/**
 * Local SVG avatar creator — no external API.
 * Gender, face, hair, skin, hijab, accessories.
 */
export default function AvatarCreator(props) {
  return <AvatarBuilder {...props} />;
}
