import { Hero } from './components/Hero'
import { PlaceholderPage } from './components/PlaceholderPage'
import { useHashRoute } from './hooks/useHashRoute'

const PAGES: Record<string, { title: string; description: string }> = {
  '/use-cases': {
    title: 'Use cases',
    description:
      'See how teams put Orca to work across planning, execution, and everything in between. This page is coming soon.',
  },
  '/developers': {
    title: 'Developers',
    description: 'Docs, APIs, and everything you need to build on top of Orca. This page is coming soon.',
  },
  '/blog': {
    title: 'Blog',
    description: 'News, product updates, and ideas from the Orca team. This page is coming soon.',
  },
  '/about-us': {
    title: 'About us',
    description: 'The story and the people behind Orca. This page is coming soon.',
  },
}

function App() {
  const path = useHashRoute()
  const page = PAGES[path]

  if (page) {
    return <PlaceholderPage title={page.title} description={page.description} />
  }

  return <Hero />
}

export default App
