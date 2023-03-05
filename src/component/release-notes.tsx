import React from 'react'
import { TrashIcon } from '@sanity/icons'
import { Button, Card, Spinner, Text, useToast } from '@sanity/ui'
import { SanityDocument, useClient } from 'sanity'
import { apiVersion } from '../constants'
import { dateToMonthDayYear } from '../utils'
import { CreateReleaseNoteDialog } from './create-release-note-dialog'

type ReleaseNote = SanityDocument & {
  _type: 'releaseNote'
  title: string
  textArea: string
}

const ReleaseNotes = () => {
  const [releaseNotes, setReleaseNotes] = React.useState<ReleaseNote[]>([])
  const [releaseNotesLoading, setReleaseNotesLoading] = React.useState(true)
  const [isDeletingReleaseNote, setIsDeletingReleaseNote] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [selectedReleaseNote, setSelectedReleaseNote] = React.useState<ReleaseNote | null>(null)
  const onClose = React.useCallback(() => setOpen(false), [])
  const onOpen = React.useCallback(() => setOpen(true), [])
  const client = useClient({ apiVersion })
  const toast = useToast()

  React.useEffect(() => {
    async function getReleaseNotes() {
      const notes: ReleaseNote[] = await client.fetch(`*[_type == "releaseNote"]`)
      const sortedNotes = notes.sort((a, b) => {
        return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
      })
      setReleaseNotes(sortedNotes)
      setSelectedReleaseNote(sortedNotes?.[0] ?? null)
      setReleaseNotesLoading(false)
    }
    getReleaseNotes()
  }, [open, isDeletingReleaseNote, client])

  React.useEffect(() => {
    if (!releaseNotesLoading && !releaseNotes.length) {
      onOpen()
    }
  }, [onOpen, releaseNotes.length, releaseNotesLoading])

  const handleDeleteNote = async (noteId: string) => {
    setIsDeletingReleaseNote(noteId)
    await client.delete(noteId)
    toast.push({ status: 'success', title: 'Release Note Successfully Deleted' })
    setIsDeletingReleaseNote(null)
  }

  return (
    <div style={{ textAlign: 'center', width: '60%', margin: '0 auto' }}>
      <Card padding={6} width={'80%'}>
        <Text size={4} style={{ marginBottom: '1rem' }}>
          Release Notes
        </Text>
        <hr />
      </Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          columnGap: '1rem',
          textAlign: 'left',
        }}
      >
        <Card>
          <Button
            autoFocus
            onClick={onOpen}
            style={{ cursor: 'pointer', marginBottom: '1em' }}
            text="Create New Release Note"
          />
          {releaseNotes.map((note) => (
            <Card
              onClick={() => setSelectedReleaseNote(note)}
              key={`${note._id}`}
              className={'release-note-option'}
              style={{
                cursor: 'pointer',
                padding: '14px 0 0 0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Text
                weight={selectedReleaseNote?._id === note._id ? 'bold' : 'regular'}
                muted={selectedReleaseNote?._id !== note._id}
                style={{ display: 'inline-block' }}
                size={3}
              >
                {dateToMonthDayYear(new Date(note._createdAt))}{' '}
              </Text>

              {isDeletingReleaseNote === note._id ? (
                <Spinner style={{ margin: 'auto', height: '100%' }} />
              ) : (
                <TrashIcon
                  onClick={() => handleDeleteNote(note._id)}
                  scale={4}
                  style={{ margin: 'auto', height: '100%' }}
                />
              )}
            </Card>
          ))}
        </Card>
        {releaseNotesLoading ? (
          <Card>
            <Spinner />
          </Card>
        ) : (
          <Card style={{ borderLeft: '1px solid grey' }}>
            <Text style={{ paddingLeft: '2rem' }} size={4}>
              {selectedReleaseNote?.title ?? ' ✏️ No Release Notes, Create One'}
            </Text>
            <Text style={{ padding: '1rem 0 0 2rem' }}>{selectedReleaseNote?.textArea ?? ''}</Text>
          </Card>
        )}
      </div>
      {open && <CreateReleaseNoteDialog onClose={onClose} />}
    </div>
  )
}

export { ReleaseNotes }
