/* globals describe, beforeEach, afterEach, it */

const moxios = require('moxios')
const request = require('supertest')
const { baseURL, codes } = require('./config')
const path = '/examples'
let example = {
  title: 'JestTest'
}

describe(`CRUD operations on ${path}`, () => {
  beforeEach(() => { moxios.install() })
  afterEach(() => { moxios.uninstall() })
  it(`should fetch all entrys of exapmles of ${path}`, async () => {
    await request(baseURL)
      .get(path)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(codes.success)
      .expect(res => {
        if (res.length >= 1) throw new Error('Expected response length to be greater or equal to 1')
      })
  })
  // testID
  it(`should post a new exapmle to ${path}`, async () => {
    await request(baseURL)
      .post(path)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(example)
      .expect('Content-Type', /json/)
      .expect(codes.created)
      .expect(res => {
        if (!res.body) throw new Error('Expected a response of created example')
        if (res.body.title !== 'JestTest') throw new Error('Expected respone object title to be "JestTest"')
        if (!res.body._id) throw new Error('Expected respone object to have an ID')
        else example.id = res.body._id
      })
  })
  const methodes = ['put', 'patch', 'delete']
  for (const method of methodes) {
    it(`should reject ${method} to ${path} without ID`, async () => {
      await request(baseURL)[method](path)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(codes.wrongmethod)
        .expect(res => {
          if (!res.body.error) throw new Error('Expected error message')
          if (res.body.code !== codes.wrongmethod) {
            throw new Error(`Expected response code to be ${codes.wrongmethod}`)
          }
        })
    })
  }
})

describe(`CRUD operations on ${path}/:id`, () => {
  it(`should fetch one entry of an exapmle on ${path}/:id`, async () => {
    await request(baseURL)
      .get(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(codes.success)
      .expect(res => {
        if (!res.body) throw new Error('Expected a response of created example')
        if (res.body.title !== 'JestTest') throw new Error('Expected respone object title to be "JestTest"')
        if (res.body._id !== example.id) throw new Error('Expected respone object to have the same an ID as requested')
      })
  })
  it(`should reject post to ${path} with ID`, async () => {
    await request(baseURL)
      .post(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(codes.wrongmethod)
      .expect(res => {
        if (!res.body.error) throw new Error('Expected error message')
        if (res.body.code !== codes.wrongmethod) {
          throw new Error(`Expected response code to be ${codes.wrongmethod}`)
        }
      })
  })
  it(`should put new object to ${path} with ID`, async () => {
    example.hasNewProperty = 'yes'
    await request(baseURL)
      .put(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(example)
      .expect('Content-Type', /json/)
      .expect(codes.success)
      .expect(res => {
        if (!res.body) throw new Error('Expected a response of created example')
        if (res.body.title !== 'JestTest') throw new Error('Expected respone object title to be "JestTest"')
        if (res.body._id !== example.id) throw new Error('Expected respone object to have the same an ID as requested')
        if (res.body.hasNewProperty !== 'yes') throw new Error('Expected respone object on property "hasNewProperty" to be "yes"')
      })
  })
  it(`should not patch to ${path} with an ID if request body is missing the property ID`, async () => {
    await request(baseURL)
      .patch(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ title: 'newValue' })
      .expect('Content-Type', /json/)
      .expect(codes.wrongrequest)
      .expect(res => {
        if (!res.error) throw new Error('Expected error message')
      })
  })
  it(`should patch new property value to ${path} with an ID`, async () => {
    await request(baseURL)
      .patch(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ title: 'newValue', id: example.id })
      .expect('Content-Type', /json/)
      .expect(codes.success)
      .expect(res => {
        if (!res.body) throw new Error('Expected a response of created example')
        if (res.body.title !== 'newValue') throw new Error('Expected respone object title to be "newValue"')
        if (res.body._id !== example.id) throw new Error('Expected respone object to have the same an ID as requested')
      })
  })
  it(`should delete object to ${path} with ID`, async () => {
    await request(baseURL)
      .delete(`${path}/${example.id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(codes.success)
      .expect(res => {
        if (res.body.message !== 'Successfully deleted') throw new Error('Expected error message to be "Successfully deleted"')
        if (res.body.code !== codes.success) {
          throw new Error(`Expected response code to be ${codes.success}`)
        }
      })
  })
})

// https://codewithhugo.com/testing-an-express-app-with-supertest-moxios-and-jest/
// it('should 200 and return a transformed version of GitHub response', async () => {
//   moxios.stubRequest(/api.github.com\/users/, {
//     status: 200,
//     response: {
//       blog: 'https://codewithhugo.com',
//       location: 'London',
//       bio: 'Developer, JavaScript',
//       public_repos: 39
//     }
//   })
//   const res = await request(baseURL).get('/hugo')
//   expect(res.body).toEqual({
//     blog: 'https://codewithhugo.com',
//     location: 'London',
//     bio: 'Developer, JavaScript',
//     publicRepos: 39
//   })
// })
