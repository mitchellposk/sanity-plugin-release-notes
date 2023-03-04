import React from 'react'
import { TrashIcon } from '@sanity/icons'
import { Button, Card, Text } from '@sanity/ui'
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
  const [open, setOpen] = React.useState(false)
  const [selectedReleaseNote, setSelectedReleaseNote] = React.useState<ReleaseNote | null>(null)
  const onClose = React.useCallback(() => setOpen(false), [])
  const onOpen = React.useCallback(() => setOpen(true), [])
  const client = useClient({ apiVersion })

  React.useEffect(() => {
    async function getReleaseNotes() {
      const notes: ReleaseNote[] = await client.fetch(`*[_type == "releaseNote"]`)
      const sortedNotes = notes.sort((a, b) => {
        return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
      })
      setReleaseNotes(sortedNotes)
      setSelectedReleaseNote(sortedNotes?.[0] ?? null)
    }
    getReleaseNotes()
  }, [open])

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
                padding: '12px 0 0 0',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
              }}
            >
              <Text style={{ display: 'inline-block' }} size={3}>
                {dateToMonthDayYear(new Date(note._createdAt))}{' '}
              </Text>
              <TrashIcon style={{ margin: 'auto', height: '100%' }} />
            </Card>
          ))}
        </Card>
        <Card style={{ borderLeft: '1px solid grey' }}>
          <Text style={{ paddingLeft: '2rem' }} size={4}>
            {selectedReleaseNote?.title ?? 'loading...'}
          </Text>
          <Text style={{ padding: '1rem 0 0 2rem' }}>
            {selectedReleaseNote?.textArea ?? 'loading...'}
          </Text>
        </Card>
      </div>
      {open && <CreateReleaseNoteDialog onClose={onClose} />}
    </div>
  )
}

export { ReleaseNotes }
