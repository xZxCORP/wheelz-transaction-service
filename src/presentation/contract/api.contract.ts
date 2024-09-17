import './endpoints/healthcheck/index.js'
import './endpoints/transaction/index.js'

import { api } from '@airtasker/spot'
@api({ name: 'Transaction Wheelz Service' })
export class Api {}
