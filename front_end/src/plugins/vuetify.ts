// Vuetify 3
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export const vuetify = createVuetify({
    icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    background: '#f7f9fc',
                    surface: '#ffffff',
                    primary: '#1976D2',
                    secondary: '#2D3748',
                    success: '#2e7d32',
                    error: '#c62828'
                }
            },
            dark: {
                dark: true,
                colors: {
                    background: '#0f1115',
                    surface: '#141821',
                    primary: '#90CAF9',
                    secondary: '#A0AEC0',
                    success: '#81c784',
                    error: '#ef9a9a'
                }
            }
        }
    }
})
