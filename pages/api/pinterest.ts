import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { url } = req.query

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' })
  }

  try {
    const response = await fetch(`https://api.botzaku.eu.org/api/dl/pinterest?url=${url}`)
    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch Pinterest content' })
  }
}
