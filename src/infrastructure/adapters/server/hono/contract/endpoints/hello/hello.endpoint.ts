import { body, endpoint, response } from '@airtasker/spot'
type HelloResponse = {
  message: string
}
@endpoint({
  method: 'GET',
  path: '/hello',
})
export default class Hello {
  @response({ status: 200 })
  successResponse(@body _body: HelloResponse) {}
}
