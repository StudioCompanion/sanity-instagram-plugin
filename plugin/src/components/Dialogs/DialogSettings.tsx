import * as React from 'react'
import { Box, Button, Dialog, Flex, Stack } from '@sanity/ui'
import { useSelector } from '@xstate/react'
import { z, ZodError } from 'zod'

import { FormInputText } from '../Forms/FormInputText'

import { useGlobalState } from '../../contexts/GlobalStateContext'

const settingsFormSchema = z.object({
  clientId: z
    .string({ required_error: "Your app's ID is required" })
    .min(1, "Your app's ID is required"),
  clientSecret: z
    .string({ required_error: "Your app's secret is required" })
    .min(1, "Your app's secret is required"),
  redirectUrl: z
    .string({
      required_error: "Your app's redirect uri is required",
    })
    .url('Your redirect url must be a URL'),
})

/**
 * TODO: add zod for form validation
 */
export const DialogSettings = () => {
  const [formErrors, setFormErrors] = React.useState({
    clientId: '',
    clientSecret: '',
    redirectUrl: '',
  })

  const formRef = React.useRef<HTMLDivElement>(null!)

  const globalState = useGlobalState()
  const { send } = globalState

  const isSavingSettings = useSelector(globalState, (state) =>
    state.matches('settings.settingsSaving')
  )

  const settings = useSelector(globalState, (state) => state.context.settings)

  const handleDialogClose = () => {
    send('SETTINGS_HIDE')
  }

  const handleFormData = (formData: FormData) => {
    try {
      const payload: Record<string, FormDataEntryValue> = {}

      formData.forEach((val, key) => (payload[key] = val))

      const parsedPayload = settingsFormSchema.parse(payload)

      send({ type: 'SETTINGS_SAVING', payload: parsedPayload })
    } catch (err) {
      if (err instanceof ZodError) {
        const zodErrors = err.issues.reduce((acc, issue) => {
          const input = issue.path
            .slice(-1)[0]
            .toString() as keyof typeof formErrors

          acc[input] = issue.message

          return acc
        }, {} as typeof formErrors)

        setFormErrors((s) => ({ ...s, ...zodErrors }))
      }
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    handleFormData(formData)
  }

  const handleSaveClick = () => {
    const formData = new FormData(formRef.current as unknown as HTMLFormElement)

    handleFormData(formData)
  }

  return (
    <Dialog
      header="Instagram Settings"
      id="settings"
      onClose={handleDialogClose}
      footer={
        <DialogSettingsFooter
          isSavingSettings={isSavingSettings}
          onClick={handleSaveClick}
        />
      }
      width={1}
    >
      <Box as="form" padding={4} onSubmit={handleSubmit} ref={formRef}>
        <button style={{ display: 'none' }} tabIndex={-1} type="submit" />

        <Stack space={5}>
          <FormInputText
            label="Application ID"
            name="clientId"
            disabled={isSavingSettings}
            description="This will be the Instagram app ID"
            value={settings?.clientId}
            error={formErrors.clientId}
          />
          <FormInputText
            label="Application Secret"
            name="clientSecret"
            value={settings?.clientSecret}
            disabled={isSavingSettings}
            description="This will be your Instgram app secret, it will not show again."
            error={formErrors.clientSecret}
          />
          <FormInputText
            label="Redirect URL"
            name="redirectUrl"
            value={settings?.redirectUrl}
            disabled={isSavingSettings}
            description="Where the auth should redirect too, this should be the exact same as defined in your app"
            error={formErrors.redirectUrl}
          />
        </Stack>
      </Box>
    </Dialog>
  )
}

interface DialogSettingsFooterProps {
  onClick: () => void
  isSavingSettings: boolean
}

const DialogSettingsFooter = ({
  onClick,
  isSavingSettings,
}: DialogSettingsFooterProps) => (
  <Box padding={3}>
    <Flex justify={'flex-end'}>
      <Button
        disabled={isSavingSettings}
        fontSize={1}
        text="Save"
        tone="primary"
        onClick={onClick}
      />
    </Flex>
  </Box>
)
