import { Divider, Stack } from '@chakra-ui/react'
import { Fragment } from 'react'

import type { ComponentProps } from 'react'

interface ItemListProps<T> extends Omit<ComponentProps<typeof Stack>, 'children'> {
  data: T[]
  renderItem: (data: T) => JSX.Element | boolean | null | undefined
  renderEmpty?: () => JSX.Element | boolean | null | undefined
  hasDivider?: boolean
}

export default function ItemList<T>({ data, renderItem, renderEmpty, hasDivider = false, ...props }: ItemListProps<T>) {
  return (
    <Stack {...props}>
      {data?.length === 0
        ? renderEmpty?.()
        : data.map((item, index) => {
            return (
              <Fragment key={index}>
                {renderItem(item)}
                {renderItem(item) && hasDivider && index !== data.length - 1 && <Divider />}
              </Fragment>
            )
          })}
    </Stack>
  )
}
