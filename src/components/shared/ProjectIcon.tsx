import { Layers, Map, Mountain, Radar, Satellite, Sprout, Thermometer, Trees, Waves, type LucideProps } from 'lucide-react';

/** Icons available to projects via the `icon:` field in content/projects/*.yaml. */
const ICONS = {
  layers: Layers,
  map: Map,
  mountain: Mountain,
  radar: Radar,
  satellite: Satellite,
  sprout: Sprout,
  thermometer: Thermometer,
  trees: Trees,
  waves: Waves,
};

export default function ProjectIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = ICONS[name as keyof typeof ICONS] ?? Satellite;
  return <Icon {...props} />;
}
