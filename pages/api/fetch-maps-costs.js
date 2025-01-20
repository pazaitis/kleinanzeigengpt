import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)

    // Create JWT client with billing viewer scope
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-billing.readonly']
    })

    await client.authorize()

    // Initialize BigQuery for billing data
    const bigquery = google.bigquery({
      version: 'v2',
      auth: client,
      projectId: 'kleinanzeigenllm'
    })

    // Query billing data from BigQuery
    const query = `
      SELECT
        service.description as service_description,
        SUM(cost) as total_cost,
        usage_start_time
      FROM \`kleinanzeigenllm.billing_data.gcp_billing_export_v1_*\`
      WHERE service.description = 'Maps JavaScript API'
        AND _PARTITIONTIME >= TIMESTAMP(DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
      GROUP BY service.description, usage_start_time
      ORDER BY usage_start_time DESC
    `

    const [job] = await bigquery.jobs.query({
      projectId: 'kleinanzeigenllm',
      requestBody: {
        query: query,
        useLegacySql: false
      }
    })

    return res.status(200).json({
      costs: job.rows || [],
      lastUpdated: new Date().toISOString()
    })

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      details: error.response?.data,
      stack: error.stack
    })
    return res.status(500).json({ 
      error: error.message,
      details: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
} 