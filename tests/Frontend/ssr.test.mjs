import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';

// Keep the production renderer, but prevent its server transport from listening.
registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier === '@inertiajs/vue3/server') {
            return {
                url: 'data:text/javascript,export default (render) => render',
                shortCircuit: true,
            };
        }
        return nextResolve(specifier, context);
    },
});
const render = (await import('../../bootstrap/ssr/app.js')).default;
const messages = Object.fromEntries(
    await Promise.all(
        ['en', 'id'].map(async (locale) => [
            locale,
            (
                await import(
                    `../../resources/js/locales/generated/${locale}.json`,
                    { with: { type: 'json' } }
                )
            ).default,
        ]),
    ),
);

void test('production SSR renders localized layouts and keeps consecutive requests isolated', async () => {
    for (const locale of ['en', 'id', 'en']) {
        for (const [component, key] of [
            ['auth/Login', 'authentication.heading.login'],
            ['auth/Register', 'authentication.heading.register'],
            ['auth/ConfirmPassword', 'authentication.label.confirm_password'],
            ['auth/ForgotPassword', 'authentication.heading.forgot_password'],
            ['auth/ResetPassword', 'authentication.heading.reset_password'],
            ['auth/VerifyEmail', 'authentication.heading.verify_email'],
            [
                'auth/TwoFactorChallenge',
                'authentication.heading.authentication_code',
            ],
            ['Dashboard', 'navigation.label.dashboard'],
            ['settings/Profile', 'profile.heading.settings'],
            ['settings/Security', 'security.heading.update_password'],
        ]) {
            const result = await render({
                component,
                props: {
                    name: 'Jalara',
                    auth: {
                        user: {
                            id: 1,
                            name: 'Test User',
                            email: 'test@example.com',
                            email_verified_at: '2026-01-01',
                            created_at: '2026-01-01',
                            updated_at: '2026-01-01',
                        },
                    },
                    sidebarOpen: true,
                    localization: { locale, fallbackLocale: 'en' },
                    canResetPassword: true,
                    passwordRules: '',
                    email: 'reset@example.com',
                    token: 'reset-token',
                    canManagePasskeys: true,
                    passkeys: [],
                    canManageTwoFactor: false,
                    twoFactorEnabled: false,
                    requiresConfirmation: false,
                },
                url: '/test',
                version: 'test',
                clearHistory: false,
                encryptHistory: false,
                rememberedState: {},
            });
            const expected = key
                .split('.')
                .reduce((value, part) => value[part], messages[locale]);
            assert.ok(
                result.body.includes(expected),
                `${locale} ${component} must render ${expected}`,
            );
            assert.ok(result.head.join('').includes('Jalara'));

            const appearanceLabel =
                messages[locale].appearance.heading.settings;
            const appearanceButtons = [
                ...result.body.matchAll(/<button\b[^>]*>/g),
            ].filter(([button]) =>
                button.includes(`aria-label="${appearanceLabel}"`),
            );
            assert.equal(
                appearanceButtons.length,
                1,
                `${locale} ${component} must render one appearance button`,
            );
            const headers = [
                ...result.body.matchAll(/<header\b[^>]*>[\s\S]*?<\/header>/g),
            ];
            assert.ok(
                headers.some(([header]) =>
                    header.includes(`aria-label="${appearanceLabel}"`),
                ),
                component,
            );
            assert.doesNotMatch(
                result.body,
                /href="[^"]*settings\/appearance/,
                component,
            );

            for (const [form] of result.body.matchAll(/<form\b[^>]*>/g)) {
                assert.match(form, /\bnovalidate(?:\s|=|>)/, component);
            }
            assert.doesNotMatch(
                result.body,
                /<input\b[^>]*\btype="email"/,
                component,
            );
            assert.doesNotMatch(
                result.body,
                /<input\b[^>]*\srequired(?:\s|=|>)/,
                component,
            );
            for (const [input] of result.body.matchAll(
                /<input\b[^>]*\bname="email"[^>]*>/g,
            )) {
                assert.match(input, /\btype="text"/, component);
                assert.match(input, /\binputmode="email"/, component);
            }

            if (component === 'settings/Profile') {
                assert.ok(result.body.includes('value="Test User"'));
                assert.ok(result.body.includes('value="test@example.com"'));
            }

            if (component === 'auth/ResetPassword') {
                assert.ok(result.body.includes('value="reset@example.com"'));
            }
        }
    }
});
