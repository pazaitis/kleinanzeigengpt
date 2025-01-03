export default function Home() {
  return (
    <div>
      <h1>Kleinanzeigen Scraper</h1>
      <p>API endpoints:</p>
      <ul>
        <li>/api/scrape - Trigger scraping (POST)</li>
        <li>/api/data - Get data (GET)</li>
      </ul>
    </div>
  )
} 