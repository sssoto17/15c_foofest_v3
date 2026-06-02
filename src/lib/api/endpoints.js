const {
	NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
	NEXT_PUBLIC_FOO_FEST_API_URL,
} = process.env;

export const endpointAPI = NEXT_PUBLIC_FOO_FEST_API_URL;
export const endpointOrders = `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/reservations`;
export const endpointGuests = `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/guests`;
export const endpointKey = NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
