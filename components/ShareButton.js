import { useState, useRef, useEffect } from 'react';
import { 
  ClipboardDocumentIcon, 
  ShareIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline';
import Toast from './Toast';

export default function ShareButton({ url, listingDetails }) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: ClipboardDocumentIcon,
      action: handleCopy,
    },
    {
      name: 'WhatsApp',
      icon: ShareIcon,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(
          'Check out this iPhone listing analysis I found on KleinanzeigenGPT: ' + url
        )}`, '_blank');
      },
    },
    {
      name: 'Email',
      icon: EnvelopeIcon,
      action: () => {
        const subject = 'iPhone Listing Analysis from KleinanzeigenGPT';
        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { margin-bottom: 20px; }
    .listing-card { 
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      background: #f9fafb;
    }
    .listing-image {
      width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .price {
      font-size: 24px;
      font-weight: bold;
      color: #059669;
      margin: 8px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #2563eb;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      margin: 16px 0;
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Hey! 👋</h2>
      <p>I found an interesting iPhone listing that I'd like to share with you.</p>
    </div>

    <div class="listing-card">
      ${listingDetails?.images?.[0] ? `
        <img 
          src="${listingDetails.images[0]}" 
          alt="${listingDetails.title}" 
          class="listing-image"
        />
      ` : ''}
      
      <h3>${listingDetails?.title || 'iPhone Listing'}</h3>
      <div class="price">${listingDetails?.price || ''}</div>
      ${listingDetails?.description ? `
        <p>${listingDetails.description.substring(0, 200)}${listingDetails.description.length > 200 ? '...' : ''}</p>
      ` : ''}
    </div>

    <p>I used KleinanzeigenGPT to analyze this listing. You can see the full analysis here:</p>
    <a href="${url}" class="cta-button">View Analysis</a>

    <div class="footer">
      <p>This analysis was done by KleinanzeigenGPT, an AI-powered tool that helps verify iPhone listings on Kleinanzeigen.de</p>
    </div>
  </div>
</body>
</html>`;

        const plainTextBody = `
Hey!

I found an interesting iPhone listing that I'd like to share with you.

${listingDetails?.title || 'iPhone Listing'}
${listingDetails?.price || ''}
${listingDetails?.description ? listingDetails.description.substring(0, 200) + '...' : ''}

Check out the full analysis here: ${url}

This analysis was done by KleinanzeigenGPT, an AI-powered tool that helps verify iPhone listings on Kleinanzeigen.de.

Best regards`;

        window.open(
          `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainTextBody)}`,
          '_blank'
        );
      },
    },
  ];

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ShareIcon className="h-5 w-5" />
          <span>Share</span>
        </button>

        {/* Share Options Dropdown */}
        {showOptions && (
          <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  role="menuitem"
                >
                  <option.icon className="h-5 w-5" />
                  <span>{option.name}</span>
                  {option.name === 'Copy Link' && copied && (
                    <span className="ml-2 text-green-600 text-xs">Copied!</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Toast 
        message="Link copied to clipboard!" 
        isVisible={showToast} 
      />
    </>
  );
} 