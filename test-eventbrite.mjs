import fs from 'fs/promises';

// Read .dev.vars file
const devVars = await fs.readFile('.dev.vars', 'utf-8');
const tokenMatch = devVars.match(/EVENTBRITE_PRIVATE_TOKEN\s*=\s*["']?([^"'\n]+)["']?/);
const token = tokenMatch ? tokenMatch[1].trim() : null;

if (!token) {
  console.error('❌ No EVENTBRITE_PRIVATE_TOKEN found in .dev.vars');
  process.exit(1);
}

const ORGANISATION_ID = '3046207224';
const ORGANIZER_ID = '4248932779';

console.log('🔍 Fetching events from Eventbrite...');
console.log(`   Organisation ID: ${ORGANISATION_ID}`);
console.log(`   Organizer ID: ${ORGANIZER_ID}`);
console.log('');

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

  if (!response.ok) {
    console.error(`❌ API Error: ${response.status} ${response.statusText}`);
    const errorText = await response.text();
    console.error('Response:', errorText);
    process.exit(1);
  }

  const data = await response.json();
  const events = data.events || [];

  console.log(`✅ Successfully fetched ${events.length} total events`);
  console.log('');

  // Filter events
  const publicEvents = events.filter(e => e.organizer_id === ORGANIZER_ID && e.listed === true);
  const wrongOrganizer = events.filter(e => e.organizer_id !== ORGANIZER_ID);
  const notListed = events.filter(e => e.organizer_id === ORGANIZER_ID && e.listed !== true);

  console.log(`📊 Event breakdown:`);
  console.log(`   ✅ Public events (correct organizer + listed): ${publicEvents.length}`);
  console.log(`   ⚠️  Events with wrong organizer ID: ${wrongOrganizer.length}`);
  console.log(`   ⚠️  Events with correct organizer but not listed: ${notListed.length}`);
  console.log('');

  if (publicEvents.length > 0) {
    console.log('📅 Public events that will show on awards page:');
    publicEvents.forEach(event => {
      const isPast = new Date(event.end.local) < new Date();
      const status = isPast ? '🕒 PAST' : '✨ UPCOMING';
      console.log(`   ${status} ${event.name.text}`);
      console.log(`      Start: ${event.start.local}`);
      console.log(`      Listed: ${event.listed}`);
      console.log(`      Organizer ID: ${event.organizer_id}`);
      console.log('');
    });
  }

  if (wrongOrganizer.length > 0) {
    console.log('⚠️  Events with WRONG organizer ID (won\'t show):');
    wrongOrganizer.forEach(event => {
      console.log(`   ❌ ${event.name.text}`);
      console.log(`      Organizer ID: ${event.organizer_id} (expected: ${ORGANIZER_ID})`);
      console.log('');
    });
  }

  if (notListed.length > 0) {
    console.log('⚠️  Events NOT listed publicly (won\'t show):');
    notListed.forEach(event => {
      console.log(`   ❌ ${event.name.text}`);
      console.log(`      Listed: ${event.listed}`);
      console.log('');
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
