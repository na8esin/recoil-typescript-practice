// src/mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  // Handles a GET /user request
  rest.get('/fakeApi/user', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'admin',
      }),
    )
  }),
]