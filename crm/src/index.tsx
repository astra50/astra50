import * as Sentry from '@sentry/react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'

Sentry.init({
    dsn: 'https://2e8513380c034298aaa69222dcc9366d@o4505595929034752.ingest.sentry.io/4505596927279104',
})

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App/>)
