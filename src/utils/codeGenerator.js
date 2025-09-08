import Product from "../models/product.model.js";

export async function generateNextCode(lastCode = "code-0") {
  const match = lastCode?.match(/^([a-zA-Z\-]+)(\d+)$/);
  const prefix = match?.[1] || "code-";
  const baseNumber = match ? parseInt(match[2], 10) : 0;

  let nextNumber = baseNumber + 1;
  let nextCode = `${prefix}${nextNumber}`;

//   verifica si ya existe
while (await Product.exists({ code: nextCode })) {
    nextNumber++;
    nextCode = `${prefix}${nextNumber}`;
}

  console.log(`[CODE GEN] ${lastCode} → ${nextCode}`);
  return nextCode;
}