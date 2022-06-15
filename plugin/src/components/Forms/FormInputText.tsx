import { Box, TextInput } from '@sanity/ui'
import * as React from 'react'

import { FormLabel } from './FormLabel'

type Props = {
  description?: string
  disabled?: boolean
  error?: string
  label: string
  name: string
  placeholder?: string
  value?: string
}

type Ref = HTMLInputElement

export const FormInputText = React.forwardRef<Ref, Props>(
  (props: Props, ref) => {
    const { description, disabled, error, label, name, placeholder, value } =
      props

    return (
      <Box>
        {/* Label */}
        <FormLabel
          description={description}
          error={error}
          label={label}
          name={name}
        />
        {/* Input */}
        <TextInput
          autoComplete="off"
          autoFocus={true}
          defaultValue={value}
          disabled={disabled}
          id={name}
          name={name}
          placeholder={placeholder}
          ref={ref}
        />
      </Box>
    )
  }
)
