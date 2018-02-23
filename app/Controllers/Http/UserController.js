const { each } = require('lodash')

const User = use('App/Models/User')
const { validate } = use('Validator')

class UserController {
  // POST
  async login({ auth, request, response }) {
    try {
      const { email, password } = request.all()
      return auth.attempt(email, password)
    } catch (err) {
      return response.status(500).send({ error: 'Failed to login.' })
    }
  }

  // GET
  async index({ auth, response }) {
    try {
      response.send(auth.user)
    } catch (err) {
      response.status(500).send({ error: 'Failed to GET users.' })
    }
  }
  // GET :id
  async show({ auth, params, response }) {
    try {
      if (auth.user.id === Number(params.id)) {
        response.send(auth.user)
      } else {
        response.status(403).send({ error: 'You don\'t have permission to view this user.' })
      }
    } catch (err) {
      response.status(500).send({ error: `Failed to GET user (id: ${params.id})` })
    }
  }
  // POST
  async store({ request, response }) {
    try {
      const userData = request.only(['email', 'username', 'password'])
      const user = await User.create(userData)
      response.send(user)
    } catch (err) {
      response.status(500).send(err)
    }
  }
  // PUT/PATCH
  async update({ params, request, response }) {
    try {
      const user = new User()
      each(request.post(), (value, key) => {
        user[key] = key === 'tags' ? JSON.stringify(value) : value
      })
      await User
        .query()
        .where('id', params.id)
        .update(user)
      const updatedUser = await User
        .find(params.id)
      response.send(updatedUser)
    } catch (err) {
      response.status(500).send(err)
    }
  }
  // DELETE
  async destroy({ params, response }) {
    try {
      const user = await User.find(params.id)
      await user.delete()
      response.send(user)
    } catch (err) {
      response.status(500).send({ error: `Failed to DELETE user (id: ${params.id}).` })
    }
  }
}

module.exports = UserController
