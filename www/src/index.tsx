import * as Sentry from '@sentry/react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'

Sentry.init({
    dsn: 'https://794ca0ad54404a1b9ba107277bc3f236@o4505595929034752.ingest.sentry.io/4505595931459584',
})

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App/>)
