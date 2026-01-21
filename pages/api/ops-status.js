import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        // Determine path from ENV or use default ecosystem layout
        const relativePath = process.env.INTERNAL_OPS_PATH || '../neo-smart-factory/internal-ops/state.json';
        const statePath = path.resolve(process.cwd(), relativePath);

        if (fs.existsSync(statePath)) {
            const stateContent = fs.readFileSync(statePath, 'utf8');
            const state = JSON.parse(stateContent);
            return res.status(200).json(state);
        } else {
            // Fallback/Mock if file is missing (e.g. production or environment issue)
            return res.status(200).json({
                version: "0.5.3",
                codename: "LOCAL_SATELLITE",
                status: "isolated",
                forge: {
                    core: { status: "unknown", notes: "Core sequence heartbeat not detected." },
                    frontend: { status: "completed", notes: "Local interface active." },
                    cli: { status: "unknown", notes: "CLI connectivity restricted." }
                }
            });
        }
    } catch (error) {
        console.error('[OPS_API_ERROR]:', error);
        return res.status(500).json({ error: 'Failed to sync with internal ops' });
    }
}
