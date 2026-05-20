import { LogEntry } from '@genai-fi/recom';
import { TFunction } from 'i18next';

export const MAX_ENGAGEMENT = 2.0;

export function activityContribution(log: LogEntry): number | null {
    switch (log.activity) {
        case 'like':         return 0.1;
        case 'unreact':      return -0.1;
        case 'share_public': return 0.5;
        case 'follow':       return 0.5;
        case 'unfollow':     return -0.5;
        case 'hide':         return -0.5;
        case 'dwell': {
            const ms = log.value || 0;
            return Math.max(0, Math.min(1, (ms - 2000) / 8000)) * 0.3;
        }
        case 'comment': {
            const len = log.value || 0;
            return Math.min(1, len / 80) * 0.6;
        }
        default:
            return null;
    }
}

export function generateMessage(log: LogEntry, t: TFunction) {
    switch (log.activity) {
        case 'engagement':
            return t('feed.actionlog.engagement', {
                score: Math.min(10, Math.max(0, (log.value || 0) * 10)).toFixed(),
            });

        case 'inactive':
            return t('feed.actionlog.inactive', { time: ((log.value || 0) / 1000).toFixed(1) });

        case 'dwell':
            return t('feed.actionlog.dwell', { time: ((log.value || 0) / 1000).toFixed(1) });

        case 'comment':
            return t('feed.actionlog.comment', { length: log.value || 0 });

        default:
            return t(`feed.actionlog.${log.activity}`);
    }
}