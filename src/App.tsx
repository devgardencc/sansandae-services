import { useState, type FormEvent } from 'react'
import { CalendarDays, Check, ChevronRight, Copy, MapPin } from 'lucide-react'
import { compressToEncodedURIComponent } from 'lz-string'
import { toast, Toaster } from 'sonner'
import { Button } from './components/ui/button'
import { Calendar } from './components/ui/calendar'
import { Input } from './components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'

type TripData = {
  mountain: string
  address: string
  addressLink: string
  time: string
  spot: string
  spotLink: string
}

const initialForm = {
  mountain: '', address: '', addressLink: '', date: undefined as Date | undefined,
  time: '', spot: '', spotLink: '',
}
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const set = (field: 'mountain' | 'address' | 'addressLink' | 'time' | 'spot' | 'spotLink', value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => current.filter((item) => item !== field))
  }
  const setTimePart = (part: 'hour' | 'minute', value: string) => {
    setForm((current) => {
      const [currentHour = '', currentMinute = ''] = current.time.split(':')
      const hour = part === 'hour' ? value : currentHour
      const minute = part === 'minute' ? value : currentMinute
      return { ...current, time: `${hour}:${minute}` }
    })
    setErrors((current) => current.filter((item) => item !== 'time'))
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = ['mountain', 'address', 'addressLink', 'date', 'time', 'spot', 'spotLink'] as const
    const missing = required.filter((field) => {
      const value = field === 'date' ? form.date : form[field]
      if (field === 'time') return !timePattern.test(form.time)
      return !value || (typeof value === 'string' && !value.trim())
    })
    setErrors(missing)
    if (missing.length) {
      toast.error('Заполните все обязательные поля, включая часы и минуты')
      return
    }
    const date = form.date!
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const data: TripData = {
      mountain: form.mountain.trim(), address: form.address.trim(), addressLink: form.addressLink.trim(),
      time: `${localDate}T${form.time}`, spot: form.spot.trim(), spotLink: form.spotLink.trim(),
    }
    const encoded = compressToEncodedURIComponent(JSON.stringify(data))
    setResult(`?id=${encoded}`)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      toast.success('Скопировано')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Не удалось скопировать ссылку')
    }
  }
  const invalid = (name: string) => errors.includes(name)

  return (
    <div className="min-h-screen bg-[#fbf6f6] text-[#292222]">
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-8 sm:pt-9">
        <section className="mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-[#f0dfdf] bg-white shadow-[0_14px_50px_rgba(94,35,35,0.07)]">
          <div className="border-b border-[#f2e8e7] px-6 py-7 sm:px-10 sm:py-9">
            <img src="/logo.png" alt="Логотип" className="h-11 w-auto object-contain" />
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.17em] text-[#a65358]">План поездки</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#342527] sm:text-[30px]">Ссылка на поездку в горы</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#778075]">Заполните данные о горе, времени и месте встречи, чтобы поделиться планом поездки.</p>
          </div>
          <form onSubmit={submit} noValidate className="space-y-6 px-6 py-7 sm:px-10 sm:py-9">
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Гора" required error={invalid('mountain')} className="sm:col-span-2">
                <Input value={form.mountain} onChange={(e) => set('mountain', e.target.value)} placeholder="Например, Халласан" aria-invalid={invalid('mountain')} />
              </Field>
              <Field label="Адрес" required error={invalid('address')} className="sm:col-span-2">
                <Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Укажите адрес начала маршрута" aria-invalid={invalid('address')} />
              </Field>
              <Field label="Ссылка на Kakao Map (адрес)" required error={invalid('addressLink')} className="sm:col-span-2">
                <Input value={form.addressLink} onChange={(e) => set('addressLink', e.target.value)} placeholder="Вставьте ссылку на карту" aria-invalid={invalid('addressLink')} />
              </Field>
              <Field label="Дата" required error={invalid('date')}>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" aria-invalid={invalid('date')} className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4 text-[#82917c]" />
                      {form.date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.date) : <span className="text-[#939a90]">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-2">
                    <Calendar mode="single" selected={form.date} onSelect={(date) => { if (!date) return; setForm((current) => ({ ...current, date })); setErrors((current) => current.filter((item) => item !== 'date')); setDatePickerOpen(false) }} />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="Время" required error={invalid('time')} errorText="Выберите часы и минуты">
                <div className="flex items-center gap-2">
                  <Select value={form.time.split(':')[0] || undefined} onValueChange={(value) => setTimePart('hour', value)}>
                    <SelectTrigger aria-label="Часы" aria-invalid={invalid('time')}>
                      <SelectValue placeholder="Часы" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0')).map((hour) => <SelectItem key={hour} value={hour}>{hour}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span aria-hidden="true" className="text-lg font-medium text-[#a43139]">:</span>
                  <Select value={form.time.split(':')[1] || undefined} onValueChange={(value) => setTimePart('minute', value)}>
                    <SelectTrigger aria-label="Минуты" aria-invalid={invalid('time')}>
                      <SelectValue placeholder="Минуты" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0')).map((minute) => <SelectItem key={minute} value={minute}>{minute}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </Field>
              <Field label="Место (spot)" required error={invalid('spot')} className="sm:col-span-2">
                <Input value={form.spot} onChange={(e) => set('spot', e.target.value)} placeholder="Укажите адрес места встречи" aria-invalid={invalid('spot')} />
              </Field>
              <Field label="Ссылка на Kakao Map (место)" required error={invalid('spotLink')} className="sm:col-span-2">
                <Input value={form.spotLink} onChange={(e) => set('spotLink', e.target.value)} placeholder="Вставьте ссылку на карту" aria-invalid={invalid('spotLink')} />
              </Field>
            </div>
            <Button type="submit" className="h-12 w-full text-[15px]">Сгенерировать ссылку <ChevronRight className="ml-1 h-4 w-4" /></Button>
            {result && <div className="space-y-2 border-t border-[#f2e8e7] pt-5">
              <label htmlFor="generated-link" className="text-sm font-medium text-[#394638]">Ссылка на поездку</label>
              <div className="flex gap-2">
                <Input id="generated-link" readOnly value={result} className="min-w-0 bg-[#fcf9f9] text-xs" />
                <Button type="button" variant="outline" onClick={copy} className="shrink-0 px-3" aria-label="Скопировать ссылку">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span className="ml-2 hidden sm:inline">Скопировать</span></Button>
              </div>
            </div>}
          </form>
        </section>
        <p className="mx-auto mt-5 flex max-w-[760px] items-center justify-center gap-1.5 text-xs text-[#929a8f]"><MapPin size={13} />Планируйте маршрут и делитесь им с попутчиками</p>
      </main>
      <Toaster position="top-center" richColors />
    </div>
  )
}

function Field({ label, required, error, errorText = 'Обязательное поле', className = '', children }: { label: string; required?: boolean; error?: boolean; errorText?: string; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className}`}>
    <label className="block text-[13px] font-medium text-[#394638]">{label}{required && <span className="ml-1 text-[#b65f54]">*</span>}</label>
    {children}
    {error && <p className="text-xs text-[#a43139]">{errorText}</p>}
  </div>
}

export default App
