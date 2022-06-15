import * as React from 'react'
import styled from 'styled-components'
import { ErrorOutlineIcon } from '@sanity/icons'
import { Box, Inline, Text, Tooltip } from '@sanity/ui'

type Props = {
  description?: string
  error?: string
  label: string
  name: string
}

const StyledErrorOutlineIcon = styled(ErrorOutlineIcon)(({ theme }) => {
  return {
    color: theme.sanity.color.spot.red,
  }
})

export const FormLabel = (props: Props) => {
  const { description, error, label, name } = props

  return (
    <Box marginBottom={3}>
      {/* Label */}
      <Inline space={2}>
        <Text as="label" htmlFor={name} size={1} weight="semibold">
          {label}
        </Text>

        {/* Error icon + tooltip */}
        {error && (
          <Text size={1}>
            <Tooltip
              content={
                <Box padding={2}>
                  <Text muted size={1}>
                    <StyledErrorOutlineIcon style={{ marginRight: '0.1em' }} />
                    {error}
                  </Text>
                </Box>
              }
              fallbackPlacements={['top', 'left']}
              placement="right"
              portal={true}
            >
              <StyledErrorOutlineIcon />
            </Tooltip>
          </Text>
        )}
      </Inline>

      {/* Description */}
      {description && (
        <Box marginY={3}>
          <Text htmlFor={name} muted size={1}>
            {description}
          </Text>
        </Box>
      )}
    </Box>
  )
}
