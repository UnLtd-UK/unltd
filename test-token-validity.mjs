import fs from 'fs/promises';

// Read .dev.vars file
const devVars = await fs.readFile('.dev.vars', 'utf-8');
const tokenMatch = devVars.match(/EVENTBRITE_PRIVATE_TOKEN\s*=\s*["']?([^"'\n]+)["']?/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

if (!token) {
  console.error('❌ No EVENTBRITE_PRIVATE_TOKEN found in .dev.vars');
  process.exit(1);
}

console.log('🔑 Token found:', token);
console.log('📡 Testing Eventbrite API call...\n');

const ORGANISATION_ID = '3046207224';

try {
  const response = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/${ORGANISATION_ID}/events/?status=live&order_by=start_asc`,
    {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  console.log(`📊 Response status: ${response.status} ${response.statusText}`);
  console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
  console.log('');

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ API Error Response:');
    console.error(errorText);
    process.exit(1);
  }

  const data = await response.json();
  console.log('✅ API call successful!');
  console.log(`✅ Found ${data.events?.length || 0} events`);
  
  if (data.events && data.events.length > 0) {
    console.log('\n📅 Sample event:');
    console.log(JSON.stringify(data.events[0], null, 2));
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.cause) {
    console.error('Cause:', error.cause);
  }
  process.exit(1);
}
