import { body, validationResult } from "express-validator";

export const validateProduct = [
    body("title").notEmpty().withMessage("El título es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria"),
    body("code").notEmpty().withMessage("El código es obligatorio"),
    body("price").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
    body("stock").isInt({ min: 0 }).withMessage("El stock debe ser un número entero positivo"),
    body("category").notEmpty().withMessage("La categoria es obligatoria"),
    body("quantity").notEmpty().withMessage("La cantidad es obligatoria"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", errors: errors.array() });
        }
        next();
    }
];