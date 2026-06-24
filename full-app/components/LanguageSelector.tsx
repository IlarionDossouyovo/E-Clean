'use client'

import { useState, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'

interface Country {
  code: string
  name: string
  lang: string
  currency: string
  flag: string
}

export default function LanguageSelector() {
  const [countries, setCountries] = useState<Country[]>([])
  const [selected, setSelected] = useState<Country | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les pays depuis l'API
    fetch('/api/i18n')
      .then(res => res.json())
      .then(data => {
        setCountries(data.countries || [])
        // Récupérer la langue sauvegardée
        const saved = localStorage.getItem('eclean_country')
        if (saved) {
          const parsed = JSON.parse(saved)
          setSelected(parsed)
        } else {
          // Par défaut: France
          setSelected(data.countries?.find((c: Country) => c.code === 'fr') || null)
        }
        setLoading(false)
      })
      .catch(() => {
        // Fallback
        setCountries([
          { code: 'fr', name: 'France', lang: 'fr', currency: 'EUR', flag: '🇫🇷' },
          { code: 'en', name: 'United Kingdom', lang: 'en', currency: 'GBP', flag: '🇬🇧' },
          { code: 'es', name: 'Spain', lang: 'es', currency: 'EUR', flag: '🇪🇸' },
          { code: 'de', name: 'Germany', lang: 'de', currency: 'EUR', flag: '🇩🇪' },
          { code: 'pt', name: 'Portugal', lang: 'pt', currency: 'EUR', flag: '🇵🇹' },
          { code: 'bj', name: 'Bénin', lang: 'fr', currency: 'XOF', flag: '🇧🇫' },
          { code: 'tg', name: 'Togo', lang: 'fr', currency: 'XOF', flag: '🇹🇬' },
          { code: 'ci', name: "Côte d'Ivoire", lang: 'fr', currency: 'XOF', flag: '🇨🇮' },
          { code: 'sn', name: 'Sénégal', lang: 'fr', currency: 'XOF', flag: '🇸🇳' },
          { code: 'cm', name: 'Cameroun', lang: 'fr', currency: 'XAF', flag: '🇨🇲' },
        ])
        setSelected({ code: 'fr', name: 'France', lang: 'fr', currency: 'EUR', flag: '🇫🇷' })
        setLoading(false)
      })
  }, [])

  const handleSelect = (country: Country) => {
    setSelected(country)
    localStorage.setItem('eclean_country', JSON.stringify(country))
    setOpen(false)
  }

  if (loading || !selected) {
    return (
      <div className="flex items-center gap-2 text-white/70">
        <Globe className="w-5 h-5" />
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-sm hidden sm:inline">{selected.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelect(country)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition ${
                  selected.code === country.code ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{country.name}</p>
                  <p className="text-xs text-gray-500">{country.lang.toUpperCase()} • {country.currency}</p>
                </div>
                {selected.code === country.code && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}