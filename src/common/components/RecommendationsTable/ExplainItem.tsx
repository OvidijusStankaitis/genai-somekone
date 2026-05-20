//import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import ScorePie from './ScorePie';
import style from './style.module.css';
import gColors from '../../../style/graphColours.json';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ScoredRecommendation, Scores } from '@genai-fi/recom';
import sColors from '@genai-fi/base/css/colours.module.css';
import { useState } from 'react';

const SCORE_SCALE = 20;
const MIN_SCORE_SIZE = 60;

/*function generateScoreMessage(item: ScoredRecommendation, t: TFunction) {
    const keys = Object.keys(item.significance) as (keyof Scores)[];
    const maxComponent = keys.reduce(
        (cmax, k, ix) => ((item.significance[k] || -1000) > (item.significance[keys[cmax]] || 0) ? ix : cmax),
        -1000
    );
    const value = item.significance[keys[maxComponent]] || -1000;
    const key = value > -1000 ? keys[maxComponent] : 'noReason';
    const part2 = t(`recommendations.labels.${key}`);

    return part2;
}*/

interface Props {
    item: ScoredRecommendation;
}

export default function ExplainItem({ item }: Props) {
    const { t } = useTranslation();
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const keys = Object.keys(item.scores) as (keyof Scores)[];
    const significance = keys.map((k) => item.significance[k] || 0);
    const sigMax = Math.max(...significance);
    const sigMin = Math.min(...significance);
    const sigDiff = sigMax - sigMin;
    const scores = keys
        .map((k) => ({
            name: k,
            score: item.features[k] || 0,
            significance: sigDiff > 0 ? ((item.significance[k] || 0) - sigMin) / sigDiff : item.significance[k] || 0,
        }))
        .filter((s) => s.score > 0 && s.significance > 0);
    scores.sort((a, b) => b.significance - a.significance);

    return (
        <li data-testid="explain-item">
            <div className={style.listIcon}>
                <LightbulbIcon fontSize="large" />
                <h2>{t('recommendations.titles.explainScore')}</h2>
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
                            <p>{t('recommendations.tooltips.engageExplain')}</p>
                            <p>{t('recommendations.tooltips.engageOverMax')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className={style.listColumn}>
                {scores.map((k, ix) =>
                    k.score > 0 ? (
                        <div
                            key={k.name}
                            className={style.scoreRow}
                        >
                            <div className={style.pieWithBadge}>
                                <ScorePie
                                    value={Math.min(k.score, 1)}
                                    maxValue={1}
                                    showValue={false}
                                    color={gColors[ix % gColors.length]}
                                    bgColor={sColors.bgSubdued1}
                                    size={
                                        sigDiff > 0
                                            ? k.significance * SCORE_SCALE + MIN_SCORE_SIZE
                                            : MIN_SCORE_SIZE + SCORE_SCALE / 2
                                    }
                                />
                                <div className={style.pieValueText}>
                                    {k.score > 1 ? '>100%' : `${(k.score * 100).toFixed(0)}%`}
                                </div>
                                {k.score > 1 && (
                                    <div className={style.aboveAverageBadge}>!</div>
                                )}
                            </div>
                            <div className={style.featureLabel}>
                                <strong>{t(`recommendations.features.${k.name}`)}</strong>
                                <span className={style.featureDescription}>
                                    {t(`recommendations.featureDescriptions.${k.name}`, { defaultValue: '' })}
                                </span>
                            </div>
                        </div>
                    ) : null
                )}
            </div>
        </li>
    );
}