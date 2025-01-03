# Kleinanzeigen Cloud Scraper

A Vercel-deployed scraper for Kleinanzeigen using Supabase for data storage.

## Setup

1. Create a Supabase project
2. Create a Vercel project
3. Set up environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy to Vercel:
   ```bash
   vercel
   ```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally:
   ```bash
   vercel dev
   ```

## API Endpoints

- `POST /api/scrape`: Trigger scraping job
- `GET /api/data`: Get scraped data
  - Query parameters:
    - `limit`: Number of entries (default: 10)
    - `history`: Include history (default: false)

## Monitoring

View logs in Vercel dashboard and Supabase dashboard. # kleinanzeigengpt
