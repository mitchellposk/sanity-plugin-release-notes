import { BookIcon } from '@sanity/icons'
import { definePlugin } from 'sanity'
import { ReleaseNotes } from './component'

const tool = {
  title: 'Release Notes',
  name: 'releaseNotes',
  icon: BookIcon,
  component: ReleaseNotes,
}

export const releaseNotes = definePlugin(() => {
  return {
    name: 'sanity-plugin-release-notes',
    tools: (prev) => [...prev, tool],
  }
})
