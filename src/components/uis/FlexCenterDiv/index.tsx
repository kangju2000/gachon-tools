interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className: string
  children: React.ReactNode
}

const FlexCenterDiv = ({ className, children, ...props }: Props) => {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`} {...props}>
      {children}
    </div>
  )
}

export default FlexCenterDiv
