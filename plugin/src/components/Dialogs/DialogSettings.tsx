import * as React from 'react'
import { Box, Button, Dialog, Flex, Stack } from '@sanity/ui'

import { useStore } from '../../store'
import { FormInputText } from '../Forms/FormInputText'
import { SettingsPayload } from '../../store/settings/createOrUpdateSettings'
import { useSource } from 'sanity'

/**
 * TODO: add zod for form validation
 */
export const DialogSettings = () => {
  const [submittingForm, setSubmittingForm] = React.useState(false)
  const formRef = React.useRef<HTMLDivElement>(null!)
  const { client } = useSource()

  const setShowSettingsDialog = useStore((state) => state.setShowSettingsDialog)
  const createOrUpdateSettings = useStore(
    (state) => state.createOrUpdateSettings
  )
  const { clientId, clientSecret, redirectUrl } = useStore(
    (state) => state.settings ?? {}
  )

  const handleDialogClose = () => {
    setShowSettingsDialog(() => false)
  }

  const handleFormData = async (formData: FormData) => {
    try {
      setSubmittingForm(true)

      const payload: Record<string, FormDataEntryValue> = {}

      formData.forEach((val, key) => (payload[key] = val))

      // TODO: type this better so we don't force it.
      await createOrUpdateSettings(
        payload as unknown as SettingsPayload,
        client
      )

      setSubmittingForm(false)
      setShowSettingsDialog(() => false)
    } catch (err) {
      /**
       * TODO: add a toast pop-up
       */
      console.error(err)
      setSubmittingForm(false)
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
          submittingForm={submittingForm}
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
            disabled={submittingForm}
            description="This will be the Instagram app ID"
            value={clientId}
          />
          <FormInputText
            label="Application Secret"
            name="clientSecret"
            value={clientSecret}
            disabled={submittingForm}
            description="This will be your Instgram app secret, it will not show again."
          />
          <FormInputText
            label="Redirect URL"
            name="redirectUrl"
            value={redirectUrl}
            disabled={submittingForm}
            description="Where the auth should redirect too, this should be the exact same as defined in your app"
          />
        </Stack>
      </Box>
    </Dialog>
  )
}

interface DialogSettingsFooterProps {
  onClick: () => void
  submittingForm: boolean
}

const DialogSettingsFooter = ({
  onClick,
  submittingForm,
}: DialogSettingsFooterProps) => (
  <Box padding={3}>
    <Flex justify={'flex-end'}>
      <Button
        disabled={submittingForm}
        fontSize={1}
        text="Save"
        tone="primary"
        onClick={onClick}
      />
    </Flex>
  </Box>
)
