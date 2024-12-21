const baseUrl = 'http://localhost/api'

const login = '/login';
const refresh = '/refresh'
const orders = '/orders'

const urls = {
  login: {
    base: login
  },
  refresh: {
    base: refresh
  },
  orders: {
    base: orders
  }
}

export {
  baseUrl,
  urls
}