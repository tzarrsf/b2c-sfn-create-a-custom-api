// TODO: Add this to src/routes/_app.loyalty.tsx in your SFN project

import { getConfig } from '@salesforce/storefront-next-runtime/config'
import { getAuth } from '@/middlewares/auth.server'
import type { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'

export async function loader({ context, params }: LoaderFunctionArgs) {
    const config = getConfig(context)
    const auth = getAuth(context)
    const { shortCode, organizationId } = config.commerce.api
    const siteId = config.defaultSiteId
    
    // Use the value in the "id" param as customerId if provided, else fall back
    const customerId = params.id ?? 'customer1'

    try {
        const apiUrl = `https://${shortCode}.api.commercecloud.salesforce.com/custom/loyalty-info/v1/organizations/${organizationId}/customers?c_customer_id=${customerId}&siteId=${siteId}&locale=en-US`

        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            console.log('LOYALTY', response.status, await response.text())
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        /*
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        */

        const loyalty = await response.json()
        return { loyalty }
    } catch (err) {
        return { loyalty: null, error: err instanceof Error ? err.message : 'Failed to load loyalty details' }
    }
}

export default function LoyaltyDetails() {
    const { loyalty, error } = useLoaderData<typeof loader>()

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
            </div>
        )
    }

    if (!loyalty) {
        return <p className="text-muted-foreground p-4">Loading loyalty details...</p>
    }

    return (
        <div className="p-4 bg-muted rounded-xl shadow-md max-w-md">
            <p className="text-xl font-semibold mb-2">Loyalty Status</p>
            <div>
                <p><strong>Points:</strong> {loyalty.points}</p>
                <p><strong>Tier:</strong> {loyalty.tier}</p>
                <p><strong>Points Expire:</strong> {loyalty.expirationDate}</p>                
            </div>
        </div>
    )
}