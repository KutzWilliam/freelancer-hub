import { Auth } from '@supabase/auth-ui-react'
import type { Theme } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'
import { Card, CardContent } from '../components/ui/card'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
  const customTheme: Theme = {
    default: {
      colors: {
        brand: 'hsl(var(--primary))',
        brandAccent: 'hsl(var(--primary) / 0.9)',
        brandButtonText: 'hsl(var(--primary-foreground))',
        defaultButtonBackground: 'hsl(var(--card))',
        defaultButtonBackgroundHover: 'hsl(var(--muted))',
        defaultButtonBorder: 'hsl(var(--border))',
        defaultButtonText: 'hsl(var(--foreground))',
        dividerBackground: 'hsl(var(--border))',
        inputBackground: 'hsl(var(--background))',
        inputBorder: 'hsl(var(--input))',
        inputBorderHover: 'hsl(var(--input))',
        inputBorderFocus: 'hsl(var(--ring))',
        inputText: 'hsl(var(--foreground))',
        inputLabelText: 'hsl(var(--muted-foreground))',
        inputPlaceholder: 'hsl(var(--muted-foreground))',
        messageText: 'hsl(var(--muted-foreground))',
        messageTextDanger: 'hsl(var(--destructive))',
        anchorTextColor: 'hsl(var(--primary))',
        anchorTextHoverColor: 'hsl(var(--primary) / 0.9)',
      },
      space: {
        spaceSmall: '4px',
        spaceMedium: '8px',
        spaceLarge: '16px',
        labelBottomMargin: '8px',
        anchorBottomMargin: '4px',
        emailInputSpacing: '4px',
        socialAuthSpacing: '8px',
        buttonPadding: '10px 15px',
        inputPadding: '10px 15px',
      },
      fontSizes: {
        baseBodySize: '14px',
        baseInputSize: '14px',
        baseLabelSize: '14px',
        baseButtonSize: '14px',
      },
      fonts: {
        bodyFontFamily: `inherit`,
        buttonFontFamily: `inherit`,
        inputFontFamily: `inherit`,
        labelFontFamily: `inherit`,
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: 'var(--radius)',
        buttonBorderRadius: 'var(--radius)',
        inputBorderRadius: 'var(--radius)',
      },
    },
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-foreground">FreelancerHub</span>
            </Link>
            <p className="text-muted-foreground">
              Acesse sua conta para encontrar as melhores oportunidades.
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            providers={['github']}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Sua senha',
                  button_label: 'Entrar',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Faça login',
                },
                sign_up: {
                  email_label: 'Endereço de e-mail',
                  password_label: 'Crie uma senha',
                  button_label: 'Cadastrar',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
                forgotten_password: {
                  email_label: 'Endereço de e-mail',
                  button_label: 'Enviar instruções',
                  link_text: 'Esqueceu sua senha?',
                }
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
