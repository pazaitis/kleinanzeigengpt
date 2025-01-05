import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runCommand(command, description) {
  console.log(`\n🚀 Starting ${description}...`)
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: join(__dirname, '..'),
    })
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    console.log(`✅ ${description} completed successfully`)
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error)
    throw error
  }
}

async function runAll() {
  try {
    console.log('🔄 Starting full scraping and analysis process...')
    
    // Run initial scrape
    await runCommand('npm run scrape', 'initial scrape')
    
    // Run deep scrape
    await runCommand('npm run deep-scrape', 'deep scrape')
    
    // Run analysis
    await runCommand('npm run analyze', 'GPT analysis')
    
    console.log('\n✨ All processes completed successfully!')
  } catch (error) {
    console.error('\n💥 Process failed:', error.message)
    process.exit(1)
  }
}

runAll() 