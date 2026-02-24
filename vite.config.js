import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.resolve(__dirname, 'data/db.json')

function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/data' && req.method === 'GET') {
          try {
            const data = fs.readFileSync(dbPath, 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read data' }))
          }
        } else if (req.url === '/api/data' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk.toString() })
          req.on('end', () => {
            try {
              // Basic validation
              JSON.parse(body)
              fs.writeFileSync(dbPath, body)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (e) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 5174,
    host: true // Expose to local network for smartphone access
  }
})

