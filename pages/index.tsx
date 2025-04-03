import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandTelegram,
  IconMail,
  IconDownload,
  IconTrash,
  IconHelp,
  IconChevronDown,
  IconClipboard,
  IconX,
} from '@tabler/icons-react'

interface DownloadHistory {
  url: string
  timestamp: number
}

interface PreviewModal {
  show: boolean
  type: string
  url: string
  downloadUrl: string
}

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [history, setHistory] = useState<DownloadHistory[]>([])
  const [preview, setPreview] = useState<PreviewModal>({
    show: false,
    type: '',
    url: '',
    downloadUrl: '',
  })
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "How do I download from Pinterest?",
      answer: "Simply copy the Pinterest pin URL (starts with 'pin.it' or 'pinterest.com/pin/'), paste it in the input box, and click Download.",
      isOpen: false
    },
    {
      question: "What content can I download?",
      answer: "You can download both images and videos from Pinterest pins.",
      isOpen: false
    },
    {
      question: "Is this service free?",
      answer: "Yes, PintDown is completely free to use with no limitations.",
      isOpen: false
    },
    {
      question: "Why isn't my download working?",
      answer: "Make sure you're using a valid Pinterest pin URL. If the problem persists, try refreshing the page.",
      isOpen: false
    }
  ])

  useEffect(() => {
    const savedHistory = localStorage.getItem('downloadHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (err) {
      toast.error('Failed to paste from clipboard')
    }
  }

  const clearInput = () => {
    setUrl('')
  }

  const handleDownload = async () => {
    if (!url.includes('pin.it')) {
      toast.error('Please enter a valid Pinterest URL')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/pinterest?url=${encodeURIComponent(url)}`)
      const data = await response.json()

      if (data.success) {
        const newHistory: DownloadHistory = {
          url: url,
          timestamp: Date.now(),
        }
        const updatedHistory = [newHistory, ...history].slice(0, 10)
        setHistory(updatedHistory)
        localStorage.setItem('downloadHistory', JSON.stringify(updatedHistory))

        setPreview({
          show: true,
          type: data.data.type,
          url: data.data.url,
          downloadUrl: data.data.url,
        })
      } else {
        toast.error('Failed to download content')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const closePreview = () => {
    setPreview({ show: false, type: '', url: '', downloadUrl: '' })
  }

  const toggleFAQ = (index: number) => {
    setFaqs(faqs.map((faq, i) => ({
      ...faq,
      isOpen: i === index ? !faq.isOpen : false
    })))
  }

  const loadHistoryUrl = (historyUrl: string) => {
    setUrl(historyUrl)
    scrollToTop()
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('downloadHistory')
    toast.success('History cleared!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="https://cdn.botzaku.eu.org/u0su7/_81c130d4-a57e-4294-bbca-4e4d06306ba9.jpeg"
                alt="PintDown"
                className="h-12 w-12 rounded-full"
              />
              <h1 className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                PintDown
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
            Pinterest Downloader
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Pinterest URL here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={url ? clearInput : handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title={url ? "Clear" : "Paste"}
              >
                {url ? <IconX size={20} /> : <IconClipboard size={20} />}
              </button>
            </div>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Processing...' : 'Download'}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0">
                <button
                  className="w-full py-4 flex justify-between items-center text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <IconChevronDown
                    className={`transform transition-transform ${faq.isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`pb-4 text-gray-600 ${faq.isOpen ? 'block' : 'hidden'}`}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              History
            </h2>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-red-600 px-3 py-1.5 rounded-lg border border-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
              >
                <IconTrash size={16} />
                Clear All
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No download history yet</p>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 truncate mr-4">
                    <p className="font-medium truncate">{item.url}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => loadHistoryUrl(item.url)}
                    className="text-blue-600 px-3 py-1.5 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors text-sm"
                  >
                    Use URL
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {preview.show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closePreview} />
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 relative z-10">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <IconX size={24} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Preview Content</h3>
            <div className="mb-4 rounded-lg overflow-hidden">
              {preview.type === 'MP4' ? (
                <video src={preview.url} controls className="w-full" />
              ) : (
                <img src={preview.url} alt="Preview" className="w-full" />
              )}
            </div>
            <p className="text-gray-600 text-center">
              To download, press and hold on the {preview.type === 'MP4' ? 'video' : 'image'} above, then select "Save {preview.type === 'MP4' ? 'video' : 'image'} as..."
            </p>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="flex gap-4">
                <a href="mailto:support@botzaku.eu.org" className="text-gray-600 hover:text-blue-600 transition-colors">
                  <IconMail size={24} />
                </a>
                <a href="https://instagram.com/botzaku" className="text-gray-600 hover:text-pink-600 transition-colors">
                  <IconBrandInstagram size={24} />
                </a>
                <a href="https://twitter.com/botz_aku" className="text-gray-600 hover:text-blue-400 transition-colors">
                  <IconBrandTwitter size={24} />
                </a>
                <a href="https://t.me/BotzAku" className="text-gray-600 hover:text-blue-500 transition-colors">
                  <IconBrandTelegram size={24} />
                </a>
                <a href="https://github.com/BotzIky" className="text-gray-600 hover:text-gray-900 transition-colors">
                  <IconBrandGithub size={24} />
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-gray-600 mb-4">
                PintDown - Downloader Pinterest images/videos, free, fast, and no ads.
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-gray-600">© {new Date().getFullYear()} PintDown. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
