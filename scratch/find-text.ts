import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const envFiles = ['.env', '.env.local', '.env.loacl', '.env.loacal']
envFiles.forEach(filename => {
  try {
    const envPath = path.join(__dirname, '..', filename)
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      content.split('\n').forEach(line => {
        const parts = line.split('=')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '')
          if (key) {
            process.env[key] = val
          }
        }
      })
    }
  } catch (e) {
    // Ignore
  }
})

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function findText() {
  try {
    const { data, error } = await client
      .from('종합강의시간표_1학기_전체.csv')
      .select('*')
      .limit(3000)

    if (error) {
      console.error(error)
      return
    }

    const matches: any[] = []
    data?.forEach(row => {
      const rowStr = JSON.stringify(row)
      if (rowStr.includes('기초교육원')) {
        matches.push(row)
      }
    })
    console.log('Matches for "기초교육원":', matches.length)
    if (matches.length > 0) {
      console.log('First match:', matches[0])
    } else {
      // search for "기초"
      const matches2 = data?.filter(row => JSON.stringify(row).includes('기초'))
      console.log('Matches for "기초":', matches2?.length)
      if (matches2 && matches2.length > 0) {
        console.log('First "기초" match:', matches2[0])
      }
    }
  } catch (err) {
    console.error(err)
  }
}

findText()
