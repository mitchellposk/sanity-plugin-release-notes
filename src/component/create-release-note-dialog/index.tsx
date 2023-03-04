import React, { useState } from 'react'
import {
  Card,
  Dialog,
  Box,
  TextArea,
  Button,
  TextInput,
  Label,
  useToast,
  Spinner,
} from '@sanity/ui'
import { useClient } from 'sanity'
import { v4 } from 'uuid'
import { apiVersion } from '../../constants'

type CreateReleaseNoteDialogProps = {
  onClose: () => void
}
const CreateReleaseNoteDialog = ({ onClose }: CreateReleaseNoteDialogProps) => {
  const [titleInput, setTitleInput] = useState('')
  const [textAreaInput, setTextAreaInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const client = useClient({ apiVersion })
  const toast = useToast()

  function handleTitleInputChange(event: React.FormEvent<HTMLInputElement>) {
    setTitleInput(event.currentTarget.value)
  }
  function handleTextAreaInputChange(event: React.FormEvent<HTMLTextAreaElement>) {
    setTextAreaInput(event.currentTarget.value)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsCreating(true)
    try {
      await client.createOrReplace({
        _id: v4(),
        _type: 'releaseNote',
        title: titleInput,
        textArea: textAreaInput,
      })
      toast.push({
        status: 'success',
        title: 'Release Note Successfully Created',
      })
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Error Creating Release Note',
        description: 'Please check the developer console for more details.',
      })
      console.error({ err }, 'Failed to create releaseNote document')
    }
    onClose()
  }

  return (
    <Card style={{ width: '100vw' }}>
      <Dialog
        header="New Release Note"
        id="dialog-example"
        onClose={onClose}
        zOffset={1000}
        width={2}
      >
        <Box padding={6}>
          <form onSubmit={handleSubmit}>
            <Label htmlFor="title-input" style={{ padding: '0 0 0.5rem 0' }}>
              Title
            </Label>
            <TextInput
              autoFocus
              id={'title-input'}
              value={titleInput}
              onChange={handleTitleInputChange}
            />
            <Label htmlFor="text-area-input" style={{ padding: '0 0 0.5rem 0', marginTop: '1rem' }}>
              Content
            </Label>
            <TextArea
              id={'text-area-input'}
              value={textAreaInput}
              onChange={handleTextAreaInputChange}
            />
            {isCreating ? (
              <Spinner style={{ margin: '2rem 0 0 0.5rem', width: '12rem' }} />
            ) : (
              <Button style={{ marginTop: '2rem' }} text={'Create Release Note'} type="submit" />
            )}
          </form>
        </Box>
      </Dialog>
    </Card>
  )
}

export { CreateReleaseNoteDialog }
