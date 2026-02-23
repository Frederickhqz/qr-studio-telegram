import { useState, useRef, useEffect } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import './App.css'

type QRType = 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'event' | 'whatsapp' | 'crypto'

interface QRTypeOption {
  id: QRType
  label: string
  icon: string
}

const qrTypes: QRTypeOption[] = [
  { id: 'url', label: 'Website', icon: '🔗' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'phone', label: 'Phone', icon: '📞' },
  { id: 'sms', label: 'SMS', icon: '💬' },
  { id: 'vcard', label: 'Contact', icon: '👤' },
  { id: 'event', label: 'Event', icon: '📅' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💚' },
  { id: 'crypto', label: 'Crypto', icon: '₿' },
]

const PRICE_USD = 2
const PRICE_TON = '0.5'

// Sample/placeholder data for preview
const sampleData: Record<QRType, string> = {
  url: 'https://example.com',
  text: 'Your text will appear here',
  wifi: 'WIFI:T:WPA;S:MyNetwork;P:password;;',
  email: 'mailto:hello@example.com?subject=Hello',
  phone: 'tel:+15551234567',
  sms: 'sms:+15551234567?body=Hello',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+15551234567\nEMAIL:john@example.com\nEND:VCARD',
  event: 'BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20260101T120000\nDTEND:20260101T130000\nEND:VEVENT',
  whatsapp: 'https://wa.me/15551234567',
  crypto: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.001',
}

function App() {
  const [qrType, setQrType] = useState<QRType>('url')
  const [previewQr, setPreviewQr] = useState<QRCodeStyling | null>(null)
  const [paidQr, setPaidQr] = useState<QRCodeStyling | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'ton' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const paidRef = useRef<HTMLDivElement>(null)
  
  // Telegram WebApp
  const tg = (window as any).Telegram?.WebApp
  const isTelegram = !!tg
  
  // TON Connect
  const [tonConnectUI] = useTonConnectUI()
  
  // Form state
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [email, setEmail] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [phone, setPhone] = useState('')
  const [smsBody, setSmsBody] = useState('')
  const [vCardFirstName, setVCardFirstName] = useState('')
  const [vCardLastName, setVCardLastName] = useState('')
  const [vCardPhone, setVCardPhone] = useState('')
  const [vCardEmail, setVCardEmail] = useState('')
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventStart, setEventStart] = useState('')
  const [eventEnd, setEventEnd] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  
  // Style options
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [dotsStyle, setDotsStyle] = useState('square')
  const [cornersStyle, setCornersStyle] = useState('square')
  const [qrSize, setQrSize] = useState(400)
  const [logo, setLogo] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(0.4)

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
      tg.setHeaderColor(tg.themeParams.bg_color || '#0a0a0a')
    }
  }, [tg])

  const generateQRData = (useRealData: boolean): string => {
    if (!useRealData) {
      return sampleData[qrType]
    }
    
    switch (qrType) {
      case 'url':
        return url.trim() || 'https://example.com'
      case 'text':
        return text.trim() || 'Your text here'
      case 'wifi':
        return wifiSsid ? `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;` : ''
      case 'email':
        let mailto = `mailto:${email}`
        const params = []
        if (emailSubject) params.push(`subject=${encodeURIComponent(emailSubject)}`)
        if (emailBody) params.push(`body=${encodeURIComponent(emailBody)}`)
        return params.length ? `${mailto}?${params.join('&')}` : mailto
      case 'phone':
        return phone ? `tel:${phone.replace(/\D/g, '')}` : ''
      case 'sms':
        const smsNum = phone.replace(/\D/g, '')
        return smsBody ? `sms:${smsNum}?body=${encodeURIComponent(smsBody)}` : `sms:${smsNum}`
      case 'vcard':
        const fn = `${vCardFirstName} ${vCardLastName}`.trim()
        let vcard = 'BEGIN:VCARD\nVERSION:3.0'
        if (fn) vcard += `\nFN:${fn}\nN:${vCardLastName};${vCardFirstName};;;`
        if (vCardPhone) vcard += `\nTEL:${vCardPhone}`
        if (vCardEmail) vcard += `\nEMAIL:${vCardEmail}`
        vcard += '\nEND:VCARD'
        return vcard
      case 'event':
        const start = eventStart.replace(/[-:]/g, '').replace('T', 'T')
        const end = eventEnd.replace(/[-:]/g, '').replace('T', 'T')
        let ical = 'BEGIN:VEVENT\n'
        if (eventTitle) ical += `SUMMARY:${eventTitle}\n`
        if (start) ical += `DTSTART:${start}00\n`
        if (end) ical += `DTEND:${end}00\n`
        if (eventLocation) ical += `LOCATION:${eventLocation}\n`
        ical += 'END:VEVENT'
        return ical
      case 'whatsapp':
        const waNum = phone.replace(/\D/g, '')
        return `https://wa.me/${waNum}`
      case 'crypto':
        return `bitcoin:${cryptoAddress}${cryptoAmount ? `?amount=${cryptoAmount}` : ''}`
      default:
        return 'https://example.com'
    }
  }

  const createQROptions = (data: string) => ({
    width: qrSize,
    height: qrSize,
    data,
    image: logo || undefined,
    dotsOptions: { color: fgColor, type: dotsStyle as any },
    backgroundOptions: { color: bgColor },
    cornersSquareOptions: { type: cornersStyle as any, color: fgColor },
    cornersDotOptions: { type: cornersStyle as any, color: fgColor },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 5,
      imageSize: logoSize,
    },
  })

  // Update preview QR (always visible, uses sample data)
  const updatePreviewQR = () => {
    if (!previewRef.current) return
    previewRef.current.innerHTML = ''
    
    const data = generateQRData(false) // Use sample data
    const options = createQROptions(data)
    
    const newQr = new QRCodeStyling(options)
    newQr.append(previewRef.current)
    setPreviewQr(newQr)
  }

  // Update paid QR (only after payment, uses real data)
  const updatePaidQR = () => {
    if (!paidRef.current || !isPaid) return
    paidRef.current.innerHTML = ''
    
    const data = generateQRData(true) // Use real data
    const options = createQROptions(data)
    
    const newQr = new QRCodeStyling(options)
    newQr.append(paidRef.current)
    setPaidQr(newQr)
  }

  // Update preview whenever style changes
  useEffect(() => {
    updatePreviewQR()
  }, [qrType, fgColor, bgColor, dotsStyle, cornersStyle, qrSize, logo, logoSize])

  // Update paid QR when paid or data changes
  useEffect(() => {
    if (isPaid) updatePaidQR()
  }, [isPaid, qrType, url, text, wifiSsid, wifiPassword, wifiType, email, phone, 
      vCardFirstName, vCardLastName, cryptoAddress, eventTitle, 
      fgColor, bgColor, dotsStyle, cornersStyle, qrSize, logo, logoSize])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleStripePayment = () => {
    setPaymentMethod('stripe')
    setIsProcessing(true)
    
    if (isTelegram && tg.openInvoice) {
      tg.openInvoice(`https://t.me/${import.meta.env.VITE_BOT_USERNAME}?start=qr_${Date.now()}`, (status: string) => {
        setIsProcessing(false)
        if (status === 'paid') {
          setIsPaid(true)
          setShowPaymentModal(false)
          tg.showAlert('✅ Payment successful! Your QR code is ready for download.')
        } else {
          tg.showAlert('❌ Payment cancelled.')
          setPaymentMethod(null)
        }
      })
    } else {
      window.location.href = import.meta.env.VITE_STRIPE_PAYMENT_LINK || '#'
    }
  }

  const handleTONPayment = async () => {
    setPaymentMethod('ton')
    setIsProcessing(true)
    
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: import.meta.env.VITE_TON_WALLET_ADDRESS || 'YOUR_TON_WALLET',
            amount: BigInt(parseFloat(PRICE_TON) * 1e9).toString(),
          }
        ]
      }
      
      const result = await tonConnectUI.sendTransaction(transaction)
      
      if (result) {
        setIsPaid(true)
        setShowPaymentModal(false)
        if (isTelegram) tg?.showAlert('✅ TON payment received! Your QR code is ready.')
      }
    } catch (error) {
      console.error('TON payment failed:', error)
      if (isTelegram) tg?.showAlert('❌ Payment failed.')
      setPaymentMethod(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = (format: 'png' | 'svg' | 'jpeg') => {
    if (paidQr && isPaid) {
      paidQr.download({ name: `qr-${qrType}-${Date.now()}`, extension: format })
      if (isTelegram) tg?.showAlert(`✅ Downloaded as ${format.toUpperCase()}`)
    }
  }

  const renderForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="form-group">
            <label>Website URL</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourwebsite.com" />
          </div>
        )
      case 'text':
        return (
          <div className="form-group">
            <label>Your Text</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter any text..." rows={4} />
          </div>
        )
      case 'wifi':
        return (
          <>
            <div className="form-group">
              <label>Network Name</label>
              <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="My WiFi" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="form-group">
              <label>Security</label>
              <select value={wifiType} onChange={(e) => setWifiType(e.target.value)}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </>
        )
      case 'email':
        return (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Subject" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Message body" rows={3} />
            </div>
          </>
        )
      case 'phone':
        return (
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
        )
      case 'sms':
        return (
          <>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder="SMS message" rows={3} />
            </div>
          </>
        )
      case 'vcard':
        return (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" value={vCardFirstName} onChange={(e) => setVCardFirstName(e.target.value)} placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" value={vCardLastName} onChange={(e) => setVCardLastName(e.target.value)} placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} placeholder="john@example.com" />
            </div>
          </>
        )
      case 'crypto':
        return (
          <>
            <div className="form-group">
              <label>Bitcoin Address</label>
              <input type="text" value={cryptoAddress} onChange={(e) => setCryptoAddress(e.target.value)} placeholder="bc1q..." />
            </div>
            <div className="form-group">
              <label>Amount (BTC)</label>
              <input type="number" value={cryptoAmount} onChange={(e) => setCryptoAmount(e.target.value)} placeholder="0.001" step="0.0001" />
            </div>
          </>
        )
      case 'event':
        return (
          <>
            <div className="form-group">
              <label>Event Title</label>
              <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Meeting" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start</label>
                <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} />
              </div>
              <div className="form-group">
                <label>End</label>
                <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Conference Room A" />
            </div>
          </>
        )
      case 'whatsapp':
        return (
          <div className="form-group">
            <label>WhatsApp Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">QR Studio</span>
        </div>
        {isPaid && <div className="paid-badge">✓ PAID</div>}
      </header>

      <main className="main">
        <div className="panel form-panel">
          <div className="section">
            <h3>QR Type</h3>
            <div className="type-grid">
              {qrTypes.map((type) => (
                <button
                  key={type.id}
                  className={`type-btn ${qrType === type.id ? 'active' : ''}`}
                  onClick={() => setQrType(type.id)}
                >
                  <span className="type-icon">{type.icon}</span>
                  <span className="type-label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Your Details</h3>
            {renderForm()}
          </div>

          <div className="section">
            <h3>Style</h3>
            
            <div className="option-group">
              <label>Colors</label>
              <div className="color-row">
                <div className="color-picker-wrap">
                  <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
                  <span>{fgColor}</span>
                </div>
                <div className="color-picker-wrap">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                  <span>{bgColor}</span>
                </div>
              </div>
            </div>

            <div className="option-group">
              <label>Pattern</label>
              <select value={dotsStyle} onChange={(e) => setDotsStyle(e.target.value)}>
                <option value="square">Square</option>
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>

            <div className="option-group">
              <label>Logo</label>
              {logo ? (
                <div className="logo-preview-section">
                  <img src={logo} alt="Logo" className="logo-thumb" />
                  <button className="remove-logo" onClick={() => setLogo(null)}>Remove</button>
                  <div className="slider-group">
                    <label>Size: {Math.round(logoSize * 100)}%</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="0.5" 
                      step="0.05" 
                      value={logoSize} 
                      onChange={(e) => setLogoSize(parseFloat(e.target.value))} 
                    />
                  </div>
                </div>
              ) : (
                <label className="upload-btn">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} hidden />
                  <span>+ Upload Logo</span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="panel preview-panel">
          <div className="preview-header">
            <h3>{isPaid ? '✅ Your QR Code' : '👁️ Preview'}</h3>
            {!isPaid && <span className="preview-badge">SAMPLE DATA</span>}
          </div>
          
          <div className={`preview-card ${!isPaid ? 'preview-mode' : ''}`}>
            {isPaid ? (
              <div ref={paidRef} />
            ) : (
              <>
                <div ref={previewRef} />
                <div className="preview-overlay">
                  <span>PREVIEW</span>
                </div>
              </>
            )}
          </div>

          {isPaid ? (
            <div className="download-btns">
              <button onClick={() => handleDownload('png')}>PNG</button>
              <button onClick={() => handleDownload('svg')}>SVG</button>
              <button onClick={() => handleDownload('jpeg')}>JPEG</button>
            </div>
          ) : (
            <div className="pay-section">
              <p className="pay-text">Enter your details above, then pay to generate your real QR code</p>
              <button className="pay-generate-btn" onClick={() => setShowPaymentModal(true)}>
                💳 Pay ${PRICE_USD} to Generate
              </button>
              <p className="pay-note">or ≈ {PRICE_TON} TON</p>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowPaymentModal(false)}>×</button>
            
            <div className="payment-icon">◈</div>
            <h2>Complete Payment</h2>
            <p className="payment-subtitle">Generate your QR code with your actual data</p>
            
            <div className="price-tag-modal">
              <span className="price">${PRICE_USD}.00</span>
              <span className="price-alt">≈ {PRICE_TON} TON</span>
            </div>
            
            <div className="payment-methods-modal">
              <button 
                className={`pay-btn-modal stripe ${paymentMethod === 'stripe' ? 'active' : ''}`}
                onClick={handleStripePayment}
                disabled={isProcessing}
              >
                {isProcessing && paymentMethod === 'stripe' ? 'Processing...' : '💳 Pay with Card'}
              </button>
              
              <div className="or-divider">— or —</div>
              
              <TonConnectButton />
              
              <button 
                className={`pay-btn-modal ton ${paymentMethod === 'ton' ? 'active' : ''}`}
                onClick={handleTONPayment}
                disabled={isProcessing || !tonConnectUI.connected}
              >
                {isProcessing && paymentMethod === 'ton' ? 'Processing...' : '💎 Pay with TON'}
              </button>
            </div>
            
            <p className="secure-note">🔒 Secure payment. Instant delivery.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
