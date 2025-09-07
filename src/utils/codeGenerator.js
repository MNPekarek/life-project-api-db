export function generateNextCode(lastCode = "code-0") {
  const match = lastCode.match(/^([a-zA-Z\-]+)(\d+)$/);
  if (!match) {
    console.warn("[CODE GEN] Formato no reconocido:", lastCode);
    return "code-1";
  }

  const prefix = match[1];
  const number = parseInt(match[2], 10);
  const nextNumber = number + 1;

  const nextCode = `${prefix}${nextNumber}`;
  console.log(`[CODE GEN] ${lastCode} → ${nextCode}`);
  return nextCode;
}