import { useState, type FormEvent } from 'react'
import { CalendarDays, Check, ChevronRight, Copy, Mountain, MapPin } from 'lucide-react'
import { compressToEncodedURIComponent } from 'lz-string'
import { toast, Toaster } from 'sonner'
import { Button } from './components/ui/button'
import { Calendar } from './components/ui/calendar'
import { Input } from './components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { Textarea } from './components/ui/textarea'

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

function App() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const set = (field: 'mountain' | 'address' | 'addressLink' | 'time' | 'spot' | 'spotLink', value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => current.filter((item) => item !== field))
  }
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const required = ['mountain', 'address', 'addressLink', 'date', 'time', 'spot', 'spotLink'] as const
    const missing = required.filter((field) => {
      const value = field === 'date' ? form.date : form[field]
      return !value || (typeof value === 'string' && !value.trim())
    })
    setErrors(missing)
    if (missing.length) {
      toast.error('Заполните все обязательные поля')
      return
    }
    const date = form.date!
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const data: TripData = {
      mountain: form.mountain.trim(), address: form.address.trim(), addressLink: form.addressLink.trim(),
      time: `${localDate}T${form.time}`, spot: form.spot.trim(), spotLink: form.spotLink.trim(),
    }
    const encoded = compressToEncodedURIComponent(JSON.stringify(data))
    setResult(`${window.location.origin}${window.location.pathname}?id=${encoded}`)
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
    <div className="min-h-screen bg-[#f6f7f4] text-[#202820]">
      <header className="mx-auto flex h-[76px] max-w-6xl items-center px-5 sm:px-8">
        <img src="/logo.png" alt="Логотип" className="h-11 w-auto object-contain" />
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-8 sm:pt-9">
        <section className="mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-[#e5e9e1] bg-white shadow-[0_14px_50px_rgba(39,54,37,0.06)]">
          <div className="border-b border-[#edf0eb] px-6 py-7 sm:px-10 sm:py-9">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff5e9] text-[#53794a]"><Mountain size={21} /></div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.17em] text-[#77906e]">План поездки</p>
            <h1 className="text-2xl font-semibold tracking-tight text-[#263326] sm:text-[30px]">Ссылка на поездку в горы</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#778075]">Заполните данные о горе, времени и месте встречи, чтобы поделиться планом поездки.</p>
          </div>
          <form onSubmit={submit} noValidate className="space-y-6 px-6 py-7 sm:px-10 sm:py-9">
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Гора" required error={invalid('mountain')} className="sm:col-span-2">
                <Input value={form.mountain} onChange={(e) => set('mountain', e.target.value)} placeholder="Например, Халласан" aria-invalid={invalid('mountain')} />
              </Field>
              <Field label="Адрес" required error={invalid('address')} className="sm:col-span-2">
                <Textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Укажите адрес начала маршрута" aria-invalid={invalid('address')} />
              </Field>
              <Field label="Ссылка на Kakao Map (адрес)" required error={invalid('addressLink')} className="sm:col-span-2">
                <Input value={form.addressLink} onChange={(e) => set('addressLink', e.target.value)} placeholder="Вставьте ссылку на карту" aria-invalid={invalid('addressLink')} />
              </Field>
              <Field label="Дата" required error={invalid('date')}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" aria-invalid={invalid('date')} className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4 text-[#82917c]" />
                      {form.date ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(form.date) : <span className="text-[#939a90]">Выберите дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-2">
                    <Calendar mode="single" selected={form.date} onSelect={(date) => { setForm((current) => ({ ...current, date })); setErrors((current) => current.filter((item) => item !== 'date')) }} />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="Время" required error={invalid('time')}>
                <Input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} aria-invalid={invalid('time')} />
              </Field>
              <Field label="Место (spot)" required error={invalid('spot')} className="sm:col-span-2">
                <Textarea value={form.spot} onChange={(e) => set('spot', e.target.value)} placeholder="Опишите место встречи" aria-invalid={invalid('spot')} />
              </Field>
              <Field label="Ссылка на Kakao Map (место)" required error={invalid('spotLink')} className="sm:col-span-2">
                <Input value={form.spotLink} onChange={(e) => set('spotLink', e.target.value)} placeholder="Вставьте ссылку на карту" aria-invalid={invalid('spotLink')} />
              </Field>
            </div>
            <Button type="submit" className="h-12 w-full text-[15px]">Сгенерировать ссылку <ChevronRight className="ml-1 h-4 w-4" /></Button>
            {result && <div className="space-y-2 border-t border-[#edf0eb] pt-5">
              <label htmlFor="generated-link" className="text-sm font-medium text-[#394638]">Ссылка на поездку</label>
              <div className="flex gap-2">
                <Input id="generated-link" readOnly value={result} className="min-w-0 bg-[#f8f9f7] text-xs" />
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

function Field({ label, required, error, className = '', children }: { label: string; required?: boolean; error?: boolean; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className}`}>
    <label className="block text-[13px] font-medium text-[#394638]">{label}{required && <span className="ml-1 text-[#b65f54]">*</span>}</label>
    {children}
    {error && <p className="text-xs text-[#b65f54]">Обязательное поле</p>}
  </div>
}

export default App
