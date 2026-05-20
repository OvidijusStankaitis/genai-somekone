import { engagementFromLog } from '@genai-fi/recom';
import { ContentLogEntry } from './LogBatch';
import { MAX_ENGAGEMENT } from './message';

export function normaliseEngagement(raw: number): number {
    return Math.max(0, raw / MAX_ENGAGEMENT);
}

export function batchLogs(log: ContentLogEntry[], oldBatch: ContentLogEntry[][]): ContentLogEntry[][] {
    const results: ContentLogEntry[][] = [[]];
    if (log.length === 0) return results;

    let doEnd = false;
    for (const l of log) {
        const current = results[results.length - 1];

        if (current.length > 0 && current[0].entry.id !== l.entry.id) {
            if (doEnd) {
                results.push(...oldBatch.slice(1));
                break;
            }
            results.push([l]);
        } else {
            current.push(l);
        }

        const batch = oldBatch[0];
        const bend = batch?.length - 1;
        if (
            batch &&
            batch.length > 0 &&
            l.entry.id === batch[bend].entry.id &&
            l.entry.timestamp === batch[bend].entry.timestamp
        ) {
            doEnd = true;
        }
    }

    if (results[0][0].entry.activity === 'engagement') {
        results[0][0] = {
            ...results[0][0],
            entry: {
                ...results[0][0].entry,
                value: normaliseEngagement(results[0][0].entry.value || 0),
            },
        };
    } else {
        results[0] = results[0].filter((l) => l.entry.activity !== 'engagement');
        const rawWeight = engagementFromLog(results[0].map((l) => l.entry));
        results[0].unshift({
            entry: {
                activity: 'engagement',
                timestamp: log[0].entry.timestamp,
                value: normaliseEngagement(rawWeight),
                id: log[0].entry.id,
            },
            content: log[0].content,
        });
    }

    return results;
}