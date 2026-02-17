import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'llms.txt')

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    return new NextResponse('# House of Gul - AI Agent Information\n\nVisit https://houseofgul.com for more information.', {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
