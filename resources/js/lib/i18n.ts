import type { MessageKey } from '../locales/generated/messages.ts';
import type { TranslationArguments } from '../types/index.ts';
import { createI18n } from 'vue-i18n';
import { messages } from '../locales/generated/messages.ts';
import type { AppLocale } from '../locales/generated/messages.ts';
import type { Localization } from '../types/index.ts';

export function resolveLocalization(config: Localization): {
    locale: AppLocale;
    fallbackLocale: AppLocale;
} {
    const fallbackLocale = Object.hasOwn(messages, config.fallbackLocale)
        ? (config.fallbackLocale as AppLocale)
        : 'en';
    return {
        locale: Object.hasOwn(messages, config.locale)
            ? (config.locale as AppLocale)
            : fallbackLocale,
        fallbackLocale,
    };
}

export function createAppI18n(config: Localization) {
    const { locale, fallbackLocale } = resolveLocalization(config);
    return createI18n({
        legacy: false,
        locale,
        fallbackLocale,
        messages,
        missingWarn: false,
        fallbackWarn: false,
    });
}

export function createTrans(
    translate: (
        key: string,
        parameters: Record<string, string | number>,
    ) => string,
) {
    return function trans<Key extends MessageKey>(
        key: Key,
        ...[parameters]: TranslationArguments<Key>
    ): string {
        return translate(key, parameters ?? {});
    };
}
