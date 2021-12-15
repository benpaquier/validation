const express = require("express")
const app = express()
const { body, validationResult } = require('express-validator')

let heroes = require("../heroes.json")

app.get('/', (req, res) => {
  res.json(heroes)
})

app.post('/',
  body('name')
    .exists().withMessage("name is required")
    .isLength({ min: 4 }).withMessage("name is too short"),
  body('color')
    .exists().withMessage("color is required")
    .isLength({ max: 5 }).withMessage("color is too long"),
  body('email')
    .optional()
    .isEmail().withMessage("email invalid"),
  body('team')
    .optional()
    .isIn(["good", "bad"]).withMessage("team value is not accepted"),
  body().custom(value => {
    const allowedKeys = ["name", "color", "email", "team"]
    
    // On recupere les clés du body dans un tableau de strings
    const bodyKeys = Object.keys(value)

    // Je cherche une clé dans mon body qui n'est pas dans le tableau allowedKeys
    const invalidKey = bodyKeys.find(key => !allowedKeys.includes(key))

    if (invalidKey) {
      return false
    } else {
      return true
    }
  }).withMessage("Invalid key"),
  (req, res) => {
    const { errors } = validationResult(req)
    console.log(errors)
    
    if (errors.length > 0) {
      res.status(400).json({ errors })
    } else {
      const hero = req.body
      heroes = [ ...heroes, hero ]
      res.json(hero)
    }
  }
)

module.exports = app