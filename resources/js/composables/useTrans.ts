import { useI18n } from 'vue-i18n';
import { createTrans } from '@/lib/i18n';

export function useTrans() {
    const { t } = useI18n({ useScope: 'global' });
    return { trans: createTrans((key, parameters) => t(key, parameters)) };
}
