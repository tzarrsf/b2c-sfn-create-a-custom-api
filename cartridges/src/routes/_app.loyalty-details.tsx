// src/routes/_app.loyalty-details.tsx
import type { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'

export async function loader({ context, params }: LoaderFunctionArgs) {
    const config = context.getConfig()
    const { shortCode, organizationId } = config.app.commerce.api

    // Use the value in the "id" param as customerId if provided, else fall back
    const customerId = params.id ?? 'customer1'

    try {
        const apiUrl = `https://${shortCode}.api.commercecloud.salesforce.com/custom/loyalty-info/v1/organizations/${organizationId}/customers?c_customer_id=${customerId}&siteId=${config.app.commerce.siteId}&locale=en-US`

        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${context.session.accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

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
            </div>
        </div>
    )
}