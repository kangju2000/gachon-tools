type SettingItemProps = {
  title: string
  description: string
  children: React.ReactNode
}

export function SettingItem({ title, description, children }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between rounded-12px bg-white p-10px">
      <div className="flex flex-col gap-4px">
        <h3 className="text-14px font-semibold text-gray-800">{title}</h3>
        <p className="whitespace-pre-wrap break-keep text-11px text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  )
}
