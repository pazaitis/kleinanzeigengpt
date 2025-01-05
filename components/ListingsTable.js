import { useState, useMemo } from 'react'
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function ListingsTable({ 
  listings, 
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange 
}) {
  const [sortConfig, setSortConfig] = useState({ key: 'last_seen', direction: 'desc' })
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    search: '',
    location: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  // Clean price string to number
  const getPriceNumber = (price) => {
    return parseFloat(price.replace('€', '').replace('.', '').trim())
  }

  // Sort and filter listings
  const filteredAndSortedListings = useMemo(() => {
    let filtered = [...listings]

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.location) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.priceMin) {
      filtered = filtered.filter(item => 
        getPriceNumber(item.price) >= parseFloat(filters.priceMin)
      )
    }

    if (filters.priceMax) {
      filtered = filtered.filter(item => 
        getPriceNumber(item.price) <= parseFloat(filters.priceMax)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortConfig.key === 'price') {
        const aPrice = getPriceNumber(a.price)
        const bPrice = getPriceNumber(b.price)
        return sortConfig.direction === 'asc' ? aPrice - bPrice : bPrice - aPrice
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return filtered
  }, [listings, sortConfig, filters])

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  const toggleExpand = (articleId) => {
    setExpandedId(expandedId === articleId ? null : articleId)
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className="text-sm text-gray-500">
          {filteredAndSortedListings.length} listings found
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Search title or description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Filter by location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Price (€)</label>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Price (€)</label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title & Description
                  {sortConfig.key === 'title' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center">
                  Location
                  {sortConfig.key === 'location' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('last_seen')}
              >
                <div className="flex items-center">
                  Last Seen
                  {sortConfig.key === 'last_seen' && (
                    sortConfig.direction === 'asc' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedListings.map((listing) => (
              <>
                <tr 
                  key={listing.article_id} 
                  className={`hover:bg-gray-50 cursor-pointer ${expandedId === listing.article_id ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleExpand(listing.article_id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {listing.thumbnail_url ? (
                      <div className="h-20 w-20 relative">
                        <img
                          src={listing.thumbnail_url}
                          alt={listing.title}
                          className="h-full w-full object-cover rounded-md"
                          loading="lazy"
                        />
                        {listing.url && (
                          <a
                            href={listing.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0"
                          >
                            <span className="sr-only">View details</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 flex items-center justify-center rounded-md">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-blue-600">
                      {listing.url ? (
                        <a 
                          href={listing.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {listing.title}
                        </a>
                      ) : (
                        listing.title
                      )}
                    </div>
                    {(listing.long_desc || listing.description) && (
                      <div className="text-sm text-gray-500 mt-1">
                        <div className="max-h-24 overflow-y-auto pr-4 whitespace-pre-wrap break-words">
                          {listing.description}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {listing.price}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(listing.last_seen).toLocaleString()}
                  </td>
                </tr>
                {expandedId === listing.article_id && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {listing.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Article ID: {listing.article_id}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                            <div className="prose prose-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">
                              {listing.long_desc?.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-2">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>

                          {listing.url && (
                            <div className="mt-4">
                              <a
                                href={listing.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                View Original Listing
                              </a>
                            </div>
                          )}

                          {listing.iphone_analysis && (
                            <div className="bg-blue-50 p-4 rounded-lg shadow-sm space-y-4 border border-blue-100">
                              <h4 className="text-sm font-medium text-blue-900">GPT Analysis Results</h4>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-xs font-medium text-blue-700">Identified Model</span>
                                  <p className="mt-1 text-sm text-blue-800">
                                    {listing.iphone_analysis.iphone_model || 'Unknown'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-blue-700">Storage Capacity</span>
                                  <p className="mt-1 text-sm text-blue-800">
                                    {listing.iphone_analysis.storage_gb ? `${listing.iphone_analysis.storage_gb} GB` : 'Unknown'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          {listing.thumbnail_url && (
                            <div>
                              <img
                                src={listing.thumbnail_url}
                                alt={listing.title}
                                className="w-full rounded-lg shadow-lg"
                              />
                            </div>
                          )}

                          <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Price</h4>
                              <p className="mt-1 text-base font-semibold text-green-600">{listing.price}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Location</h4>
                              <p className="mt-1 text-sm text-gray-600">{listing.location}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Posted</h4>
                              <p className="mt-1 text-sm text-gray-600">{listing.timestamp}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Last Seen</h4>
                              <p className="mt-1 text-sm text-gray-600">
                                {new Date(listing.last_seen).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(page - 1) * pageSize + 1}</span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(page * pageSize, totalCount)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalCount}</span>
                {' '}results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      page === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 