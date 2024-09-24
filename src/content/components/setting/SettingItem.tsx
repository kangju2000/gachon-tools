type SettingItemProps = {
  title: string
  description: string
  children: React.ReactNode
}

export function SettingItem({ title, description, children }: SettingItemProps) {
  return (
    <div className="flex flex-col gap-12px p-10px">
      <div>
        <h3 className="text-14px font-semibold text-gray-800">{title}</h3>
        <p className="whitespace-pre-wrap break-keep text-11px text-gray-600">{description}</p>
      </div>

      {children}
    </div>
  )
}
