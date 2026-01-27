
// Verification script for NΞØ Smart Factory features
// Run: node --env-file=.env scripts/verify-features.js

async function testTavily() {
    console.log('🧪 Testing Tavily API...');
    const url = 'https://api.tavily.com/search';
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        console.error('❌ TAVILY_API_KEY not found in env');
        return false;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: apiKey,
                query: 'latest cryptocurrency trends 2026',
                max_results: 3
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Tavily API is working. Found', data.results?.length, 'results.');
            return true;
        } else {
            console.error('❌ Tavily API failed:', response.status, await response.text());
            return false;
        }
    } catch (error) {
        console.error('❌ Tavily API error:', error.message);
        return false;
    }
}

async function testAlchemy() {
    console.log('🧪 Testing Alchemy API...');
    const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

    if (!alchemyId) {
        console.error('❌ NEXT_PUBLIC_ALCHEMY_ID not found in env');
        return false;
    }

    // Test with Base Mainnet (Chain ID 8453)
    const url = `https://base-mainnet.g.alchemy.com/v2/${alchemyId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: []
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.result) {
                console.log('✅ Alchemy API is working. Current block on Base:', parseInt(data.result, 16));
                return true;
            } else {
                console.error('❌ Alchemy API returned error:', data.error);
                return false;
            }
        } else {
            console.error('❌ Alchemy API failed:', response.status, await response.text());
            return false;
        }
    } catch (error) {
        console.error('❌ Alchemy API error:', error.message);
        return false;
    }
}

async function testPostgres() {
    console.log('🧪 Testing Postgres (Neon)...');
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        console.error('❌ DATABASE_URL not found in env');
        return false;
    }

    try {
        const { default: postgres } = await import('postgres');
        const sql = postgres(dbUrl, { ssl: 'require' });

        const result = await sql`SELECT version()`;
        console.log('✅ Postgres is working. Version:', result[0].version.substring(0, 50) + '...');
        await sql.end();
        return true;
    } catch (error) {
        console.error('❌ Postgres error:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🚀 Starting NΞØ Feature Verification...\n');

    const tavilyOk = await testTavily();
    console.log('');

    const alchemyOk = await testAlchemy();
    console.log('');

    const postgresOk = await testPostgres();
    console.log('');

    console.log('📊 Verification Summary:');
    console.log(`- Tavily: ${tavilyOk ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Alchemy: ${alchemyOk ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`- Postgres: ${postgresOk ? '✅ PASSED' : '❌ FAILED'}`);

    if (tavilyOk && alchemyOk && postgresOk) {
        console.log('\n✨ All critical features are operational!\n');
    } else {
        console.log('\n⚠️ Some features need attention.\n');
    }
}

runAllTests();
