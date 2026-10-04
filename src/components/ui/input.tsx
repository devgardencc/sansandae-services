import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
export function Input({ className, type, ...props }: InputProps) {
  return <input type={type} className={cn('flex h-10 w-full rounded-lg border border-[#ead8d8] bg-white px-3 py-2 text-sm text-[#35292a] shadow-sm outline-none placeholder:text-[#9d9292] focus-visible:border-[#b64a52] focus-visible:ring-2 focus-visible:ring-[#f5e0e1] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#b64a52] aria-[invalid=true]:focus-visible:ring-[#f5e0e1]', className)} {...props} />
}
