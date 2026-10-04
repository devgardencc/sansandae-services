import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn('flex min-h-[88px] w-full resize-y rounded-lg border border-[#dce3d8] bg-white px-3 py-2.5 text-sm text-[#293529] shadow-sm outline-none placeholder:text-[#9aa196] focus-visible:border-[#8ba47f] focus-visible:ring-2 focus-visible:ring-[#dfe9d9] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#c8796e] aria-[invalid=true]:focus-visible:ring-[#f2dfdc]', className)} {...props} />
}
