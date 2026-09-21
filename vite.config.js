import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import geminiHandler from './api/gemini.js'

/*
function geminiApiPlugin() {
  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        try {
          let body = ''
          for await (const chunk of req) {
            body += chunk
          }
          req.body = body ? JSON.parse(body) : undefined

          res.status = (statusCode) => {
            res.statusCode = statusCode
            return res
          }
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
          }

          await geminiHandler(req, res)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
*/

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist' // Optional — only if you want `build` instead of `dist`
  },
})
