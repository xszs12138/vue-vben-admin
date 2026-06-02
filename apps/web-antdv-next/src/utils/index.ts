export function getDescriptionItemFromSchema(
  schema: { key: string; label: string }[],
  data: Record<string, any>,
) {
  return schema.map((item) => ({
    key: item.key,
    label: item.label,
    content: data[item.key] ?? '-',
  }));
}
