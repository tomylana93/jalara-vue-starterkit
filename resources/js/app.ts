import { createInertiaApp, router } from '@inertiajs/vue3';
import { createAppI18n, resolveLocalization } from '@/lib/i18n';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AccountLayout from '@/layouts/account/Layout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { initializeFlashToast } from '@/lib/flashToast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    withApp(app, { page }) {
        const i18n = createAppI18n(page.props.localization);
        app.use(i18n);
        if (typeof document !== 'undefined') {
            const sync = (config: typeof page.props.localization) => {
                const { locale, fallbackLocale } = resolveLocalization(config);
                i18n.global.locale.value = locale;
                i18n.global.fallbackLocale.value = fallbackLocale;
                document.documentElement.lang = locale;
            };
            sync(page.props.localization);
            const remove = router.on('navigate', ({ detail }) =>
                sync(detail.page.props.localization),
            );
            app.onUnmount(remove);
        }
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('account/'):
                return [AppLayout, AccountLayout];
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on page load...
initializeTheme();

// This will listen for flash toast data from the server...
initializeFlashToast();
