import {
  Heart, Bone, Baby, Brain, Flower2, Stethoscope, Sparkles, Ear,
  ShieldPlus, Soup, Wind, Smile
} from 'lucide-react';

const map = {
  Heart, Bone, Baby, Brain, Flower2, Stethoscope, Sparkles, Ear,
  ShieldPlus, Soup, Wind, Smile
};

export default function Icon({ name, size = 22, ...rest }) {
  const Cmp = map[name] || Stethoscope;
  return <Cmp size={size} aria-hidden="true" {...rest} />;
}
