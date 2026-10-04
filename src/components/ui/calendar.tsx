import { DayPicker } from 'react-day-picker'
import { ru } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import 'react-day-picker/style.css'

type CalendarProps = React.ComponentProps<typeof DayPicker>
export function Calendar({ className, showOutsideDays = true, ...props }: CalendarProps) {
  return <DayPicker locale={ru} showOutsideDays={showOutsideDays} className={cn('p-2', className)} classNames={{
    months: 'flex flex-col gap-4', month: 'space-y-4', month_caption: 'relative flex h-8 items-center justify-center', caption_label: 'text-sm font-semibold capitalize',
    nav: 'absolute inset-x-0 flex items-center justify-between', button_previous: 'inline-flex h-8 w-8 items-center justify-center rounded-md text-[#99434a] hover:bg-[#fcf0f0]', button_next: 'inline-flex h-8 w-8 items-center justify-center rounded-md text-[#99434a] hover:bg-[#fcf0f0]',
    month_grid: 'w-full border-collapse space-y-1', weekdays: 'flex', weekday: 'w-9 rounded-md text-center text-[0.8rem] font-normal text-[#9d9292]', week: 'mt-2 flex w-full', day: 'relative h-9 w-9 p-0 text-center text-sm',
    day_button: 'h-9 w-9 rounded-md p-0 font-normal hover:bg-[#fcf0f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9898d]', selected: '[&>button]:bg-[#a43139] [&>button]:text-white [&>button]:hover:bg-[#87272f]', today: '[&>button]:font-bold [&>button]:text-[#a43139]', outside: 'text-[#c8bbbb] opacity-50', disabled: 'text-[#c1b6b6] opacity-40', hidden: 'invisible',
  }} components={{ Chevron: ({ orientation }) => orientation === 'left' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" /> }} {...props} />
}
