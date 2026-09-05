import { DotField } from './DotField'
import { SiteHeader } from './SiteHeader'
import './PlaceholderPage.css'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="page">
      <DotField />
      <SiteHeader />

      <main className="page-main">
        <div className="page-panel">
          <p className="page-eyebrow">Coming soon</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
          <a href="#/" className="btn btn-primary">
            Back to home
          </a>
        </div>
      </main>
    </div>
  )
}
