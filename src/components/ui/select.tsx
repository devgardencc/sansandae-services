import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger className={cn('flex h-10 w-full items-center justify-between rounded-lg border border-[#ead8d8] bg-white px-3 py-2 text-sm text-[#35292a] shadow-sm outline-none placeholder:text-[#9d9292] focus:ring-2 focus:ring-[#f5e0e1] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#b64a52]', className)} {...props}>
    {children}<SelectPrimitive.Icon asChild><ChevronDown className="h-4 w-4 text-[#99434a] opacity-70" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
}

export function SelectContent({ className, children, position = 'popper', ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content position={position} className={cn('z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-[#f0dfdf] bg-white text-[#35292a] shadow-lg', className)} {...props}>
    <SelectPrimitive.ScrollUpButton className="flex h-7 cursor-default items-center justify-center text-[#99434a]"><ChevronUp className="h-4 w-4" /></SelectPrimitive.ScrollUpButton>
    <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    <SelectPrimitive.ScrollDownButton className="flex h-7 cursor-default items-center justify-center text-[#99434a]"><ChevronDown className="h-4 w-4" /></SelectPrimitive.ScrollDownButton>
  </SelectPrimitive.Content></SelectPrimitive.Portal>
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return <SelectPrimitive.Item className={cn('relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-[#fcf0f0] focus:text-[#87272f] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}>
    <span className="absolute right-2 flex h-4 w-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="h-4 w-4 text-[#a43139]" /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
}
