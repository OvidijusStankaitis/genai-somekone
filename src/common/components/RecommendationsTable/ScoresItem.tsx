import { useTranslation } from 'react-i18next';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ScorePie from './ScorePie';
import style from './style.module.css';
import sColors from '@genai-fi/base/css/colours.module.css';
import { ScoredRecommendation, Scores } from '@genai-fi/recom';
import { useState } from 'react';

interface Props {
    item: ScoredRecommendation;
}

export default function ScoresItem({ item }: Props) {
    const { t } = useTranslation();
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const keys = Object.keys(item.scores) as (keyof Scores)[];
    const totalScore = keys.reduce((sum, k) => sum + (item.scores[k] || 0), 0);
    const breakdown = keys
        .map((k) => ({ name: k, value: item.scores[k] || 0 }))
        .filter((s) => s.value > 0);
    breakdown.sort((a, b) => b.value - a.value);

    const barColors = [
        '#005566', '#0088aa', '#00aacc', '#33bbdd',
        '#66ccee', '#99ddee', '#bbeeee', '#ddf4f4',
    ];

    return (
        <li data-testid="score-item">
            <div className={style.listIcon}>
                <EmojiEventsIcon fontSize="large" />
                <h2>{t('recommendations.titles.predictedScore')}</h2>
                <div
                    className={style.tooltipWrapper}
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                >
                    <HelpOutlineIcon
                        fontSize="small"
                        className={style.helpIcon}
                    />
                    {tooltipVisible && (
                        <div className={style.tooltip}>
                            <p><strong>{t('recommendations.labels.score')}:</strong> {t('recommendations.tooltips.scoreExplain')}</p>
                            <p><strong>{t('recommendations.labels.diversity')}:</strong> {t('recommendations.tooltips.diversityExplain')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div
                className={style.listColumn}
                style={{ alignItems: 'center' }}
            >
                <div className={style.scoreList}>
                    <ScorePie
                        value={item.score || 0}
                        maxValue={1}
                        label={t('recommendations.labels.score')}
                        showValue
                        color={sColors.secondary}
                        size={100}
                        bgColor={sColors.bgSubdued1}
                    />
                    <ScorePie
                        value={item.diversity || 0}
                        maxValue={1}
                        label={t('recommendations.labels.diversity')}
                        showValue
                        color={sColors.primary}
                        size={70}
                        bgColor={sColors.bgSubdued1}
                    />
                </div>

                {breakdown.length > 0 && totalScore > 0 && (
                    <div className={style.breakdownContainer}>
                        <div className={style.breakdownLabel}>
                            {t('recommendations.titles.scoreBreakdown')}
                        </div>
                        <div className={style.breakdownBar}>
                            {breakdown.map((seg, ix) => (
                                <div
                                    key={seg.name}
                                    className={style.breakdownSegment}
                                    style={{
                                        width: `${(seg.value / totalScore) * 100}%`,
                                        backgroundColor: barColors[ix % barColors.length],
                                    }}
                                    title={`${t(`recommendations.features.${seg.name}`)}: ${(seg.value * 100).toFixed(0)}%`}
                                />
                            ))}
                        </div>
                        <div className={style.breakdownLegend}>
                            {breakdown.map((seg, ix) => (
                                <div
                                    key={seg.name}
                                    className={style.legendItem}
                                >
                                    <span
                                        className={style.legendDot}
                                        style={{ backgroundColor: barColors[ix % barColors.length] }}
                                    />
                                    <span>{t(`recommendations.features.${seg.name}`)}</span>
                                    <span className={style.legendValue}>
                                        {(seg.value * 100).toFixed(0)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </li>
    );
}