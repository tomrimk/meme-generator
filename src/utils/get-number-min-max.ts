export function getNumberMinMax({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) {
  return Math.min(Math.max(value, min), max);
}
