import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { env } from '@/data/env/server'
import { UserSubscriptionTable } from '@/drizzle/schema'
import { createUserSubscription } from '@/server/db/subscriptions'
import { deleteUser } from '@/server/db/users'

export async function POST(req: Request) {

  // Get headers
  const headerPayload = headers()
  const svixId = (await headerPayload).get('svix-id')
  const svixTimestamp = (await headerPayload).get('svix-timestamp')
  const svixSignature = (await headerPayload).get('svix-signature')

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const SIGNING_SECRET = env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)


  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt.data
  const eventType = evt.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', body)

  switch (evt.type) {
    case "user.created": {
      await createUserSubscription({
        clerkUserId: evt.data.id,
        tier: "Free"
      })
      break
    }
    case "user.deleted": {
      if (evt.data.id != null) {
        await deleteUser(evt.data.id)
      }
      break
    }
  }

  return new Response("", { status: 200 })
}
