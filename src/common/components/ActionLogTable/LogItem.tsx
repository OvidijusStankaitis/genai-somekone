import { useTranslation } from 'react-i18next';
import { generateMessage, activityContribution, MAX_ENGAGEMENT } from './message';
import style from './style.module.css';
import { timeAgo } from '../DataCard';
import { LogEntry } from '@genai-fi/recom';

interface Props {
    item: LogEntry;
}

export default function LogItem({ item }: Props) {
    const { t } = useTranslation();
    const raw = activityContribution(item);
    const pct = raw !== null ? (raw / MAX_ENGAGEMENT) * 100 : null;

    return (
        <div
            className={style.logItem}
            data-testid="log-item"
        >
            <div className={style.logItemRow}>
                <div>{generateMessage(item, t)}</div>
                {pct !== null && (
                    <div className={pct >= 0 ? style.contributionPositive : style.contributionNegative}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(0)}%
                    </div>
                )}
            </div>
            <div className={style.time}>{timeAgo(item.timestamp)}</div>
        </div>
    );
}