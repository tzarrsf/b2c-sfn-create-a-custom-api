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
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const loyalty = await response.json()
        return { loyalty }
    } catch (err) {
        return { loyalty: null, error: err instanceof Error ? err.message : 'Failed to load loyalty details' }
    }
}

export default function LoyaltyPage() {
 const { loyaltyData, error } = useLoaderData<typeof loader>()

 if (error) {
   return (
     <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-6">My Loyalty Card</h1>
       <div className="bg-red-50 border border-red-200 rounded-lg p-6">
         <p className="text-red-800">Failed to load loyalty data: {error}</p>
       </div>
     </div>
   )
 }

 if (!loyaltyData) {
   return (
     <div className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold mb-6">My Loyalty Card</h1>
       <p>Loading...</p>
     </div>
   )
 }

 return (
   <div className="container mx-auto px-4 py-8">
     <h1 className="text-3xl font-bold mb-6">My Loyalty Card</h1>
    
     <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white">
       <div className="mb-4">
         <p className="text-sm opacity-80">Customer ID</p>
         <p className="text-xl font-bold">{loyaltyData.customerId}</p>
       </div>
      
       <div className="mb-4">
         <p className="text-sm opacity-80">Points Balance</p>
         <p className="text-4xl font-bold">{loyaltyData.points.toLocaleString()}</p>
       </div>
      
       <div className="grid grid-cols-2 gap-4">
         <div>
           <p className="text-sm opacity-80">Tier</p>
           <p className="text-lg font-semibold">{loyaltyData.tier}</p>
         </div>
         <div>
           <p className="text-sm opacity-80">Points Expire</p>
           <p className="text-lg font-semibold">{loyaltyData.expirationDate}</p>
         </div>
       </div>
     </div>
    
     {/* This is where you can update Tailwind classes to match the SFN training repo's design system */}
   </div>
 )
}
