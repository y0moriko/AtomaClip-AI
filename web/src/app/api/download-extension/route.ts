import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function GET(): Promise<NextResponse> {
  const extensionDir = path.join(process.cwd(), 'public', 'extension')
  
  const files = [
    'manifest.json',
    'content_script.js',
    'content_styles.css',
    'background.js',
    'settings.html',
    'settings.js'
  ]

  return new Promise((resolve) => {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const chunks: Buffer[] = []
    
    archive.on('data', (chunk: Buffer) => chunks.push(chunk))
    
    archive.on('end', () => {
      const zipBuffer = Buffer.concat(chunks)
      const response = new NextResponse(zipBuffer)
      response.headers.set('Content-Type', 'application/zip')
      response.headers.set('Content-Disposition', 'attachment; filename="atomaclip-extension.zip"')
      resolve(response)
    })
    
    archive.on('error', (err: Error) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }))
    })
    
    files.forEach(file => {
      const filePath = path.join(extensionDir, file)
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file })
      }
    })
    
    archive.finalize()
  }) as unknown as Promise<NextResponse>
}
