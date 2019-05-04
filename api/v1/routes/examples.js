/* globals requireWrapper */

const ExampleModel = requireWrapper('models/example/')
const logger = requireWrapper('helpers/logger')
const express = require('express')
const exampleRouter = express.Router({ mergeParams: true })

// logger.info(ExampleModel.modelName)

exampleRouter.route('/')
  .get((req, res, next) => {
    ExampleModel.find({}, (err, items) => {
      if (!err) res.status(200).json(items)
      else {
        res.status(400).json({ error: err.message, 'code': 400 })
        logger.error(err)
      }
    })
  })
  .post((req, res, next) => {
    const example = new ExampleModel(req.body)
    example.save(err => {
      if (!err) res.status(201).json(example)
      else {
        res.status(400).json({ error: err.message, code: 400 })
        logger.error(err)
      }
    })
  })
  .put((req, res, next) => {
    res.status(405).json({ 'error': 'Not Allowed! Put to URL without ID', 'code': 405 })
  })
  .patch((req, res, next) => {
    res.status(405).json({ 'error': 'Not Allowed! Patch to URL without ID', 'code': 405 })
  })
  .delete((req, res, next) => {
    res.status(405).json({ 'error': 'Not Allowed! Delete to URL without ID', 'code': 405 })
  })

exampleRouter.route('/:id')
  .get((req, res, next) => {
    ExampleModel.findOne({ _id: req.params.id }, (err, item) => {
      if (!err && item) res.status(200).json(item)
      else res.status(404).json({ 'error': `Could not find by this ID: ${req.params.id}`, 'code': 404 })
    })
  })
  .post((req, res, next) => {
    res.status(405).json({ 'error': 'Not Allowed! Post to an URL with an ID', 'code': 405 })
  })
  .delete((req, res, next) => {
    ExampleModel.findOneAndRemove({ _id: req.params.id }, (err, item) => {
      if (!err) res.status(200).json({ 'message': 'Successfully deleted', 'code': 200 })
      else res.status(404).json({ 'error': `Could not find and delete by this ID: ${req.params.id}`, 'code': 404 })
    })
  })
  .put((req, res, next) => {
    let err = {}
    if (req.params.id !== req.body.id) {
      res.status(400).json({ 'error': 'Request ID is not equal to object ID', 'code': 400 })
    } else {
      for (let key in ExampleModel.schema.paths) {
        if (!(key in req.body)) {
          if (ExampleModel.schema.paths[key].isRequired === true) {
            err[key] = `Request is missing the required field : ${key}`
          }
          if (ExampleModel.schema.paths[key].options.default !== undefined) {
            req.body[key] = ExampleModel.schema.paths[key].options.default
          }
        }
      }
      if (Object.keys(err).length !== 0) res.status(400).json({ 'error': err, 'code': 400 })
      else {
        if (req.body.__v !== undefined) delete req.body.__v
        if (req.body.id !== undefined) delete req.body.id
        ExampleModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, item) => {
          if (!err) res.status(200).json(item)
          else res.status(400).json({ 'error': err, 'code': 400 })
        })
      }
    }
  })
  .patch((req, res, next) => {
    if (req.params.id !== req.body.id) {
      res.status(400).json({ 'error': 'Request ID is not equal to object ID', 'code': 400 })
    } else {
      if (req.body.__v !== undefined) delete req.body.__v
      if (req.body.id !== undefined) delete req.body.id
      ExampleModel.findByIdAndUpdate(req.params.id, req.body, { upsert: true, new: true }, (err, item) => {
        if (!err) res.status(200).json(item)
        else res.status(404).json({ 'error': err, 'code': 404 })
      })
    }
  })

module.exports = exampleRouter
