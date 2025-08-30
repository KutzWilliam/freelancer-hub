import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Bell, BarChart3, Target, Zap, Star, ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
    const navigate = useNavigate();

    const handleNavigateToSignup = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Search className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-xl text-foreground">FreelancerHub</span>
                        </div>

                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                                Como Funciona
                            </a>
                            <a href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors">
                                Recursos
                            </a>
                            <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
                                Contato
                            </a>
                        </nav>

                        <div className="flex items-center space-x-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleNavigateToSignup}>
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-background"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="secondary" className="mb-6 px-4 py-2">
                            <Zap className="w-4 h-4 mr-2" />
                            Automatize sua busca por projetos
                        </Badge>

                        <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
                            Encontre Oportunidades de <span className="text-primary">Trabalho</span> em Um Só Lugar
                        </h1>

                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                            Pare de abrir 10 abas diferentes. Centralize vagas do Upwork, Workana, 99freelas, LinkedIn e receba
                            notificações personalizadas por email.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg" onClick={handleNavigateToSignup}>
                                Comece Gratuitamente
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                                Gratuito para começar
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                                Sem cartão de crédito
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                                Configuração em 2 minutos
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="recursos" className="py-20 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4">
                            Recursos Que Fazem a Diferença
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Economize horas de busca manual e nunca perca uma oportunidade importante novamente.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-border hover:shadow-lg transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 text-card-foreground">Centralização de Vagas</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Todas as oportunidades de Upwork, Workana, 99freelas, LinkedIn e outras plataformas em um dashboard
                                    único e organizado.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:shadow-lg transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bell className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 text-card-foreground">Notificações Inteligentes</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Receba alertas por email sobre novas oportunidades que combinam perfeitamente com suas palavras-chave
                                    e especialidades.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border hover:shadow-lg transition-shadow">
                            <CardContent className="p-8 text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BarChart3 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="font-bold text-xl mb-4 text-card-foreground">Análise de Mercado</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Insights sobre tendências de mercado, valores médios por projeto e análise da concorrência em sua
                                    área.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section id="como-funciona" className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4">Como Funciona</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Em apenas 3 passos simples, você estará recebendo as melhores oportunidades diretamente no seu email.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground font-bold text-lg">
                                1
                            </div>
                            <h3 className="font-bold text-xl mb-4">Cadastre suas Palavras-chave</h3>
                            <p className="text-muted-foreground">
                                Defina termos como "React Developer", "UI/UX Design", "Copywriter Brasil" que representam seu trabalho.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground font-bold text-lg">
                                2
                            </div>
                            <h3 className="font-bold text-xl mb-4">Automatizamos a Busca</h3>
                            <p className="text-muted-foreground">
                                Nossa plataforma monitora continuamente todas as principais fontes de projetos freelancer.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-secondary-foreground font-bold text-lg">
                                3
                            </div>
                            <h3 className="font-bold text-xl mb-4">Receba Notificações</h3>
                            <p className="text-muted-foreground">
                                Oportunidades relevantes chegam diretamente no seu email, organizadas e prontas para aplicar.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-4">
                            O Que Nossos Usuários Dizem
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="border-border">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4 italic">
                                    "Economizo pelo menos 2 horas por dia que gastava procurando projetos. Agora foco apenas no que
                                    realmente importa: entregar trabalho de qualidade."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-primary font-semibold">MC</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Maria Clara</p>
                                        <p className="text-sm text-muted-foreground">Designer UX/UI</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4 italic">
                                    "Nunca mais perdi uma oportunidade importante. As notificações chegam na hora certa e são super
                                    relevantes para meu perfil."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-primary font-semibold">RS</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Rafael Santos</p>
                                        <p className="text-sm text-muted-foreground">Desenvolvedor React</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-4 italic">
                                    "Minha renda aumentou 40% desde que comecei a usar. Consigo aplicar para muito mais projetos de
                                    qualidade."
                                </p>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-primary font-semibold">AL</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Ana Luiza</p>
                                        <p className="text-sm text-muted-foreground">Copywriter</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
                        Pronto para Automatizar sua Busca?
                    </h2>
                    <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                        Junte-se a centenas de freelancers que já economizam tempo e aumentaram sua renda com nossa plataforma.
                    </p>
                    <Button size="lg" variant="secondary" className="px-8 py-3 text-lg" onClick={handleNavigateToSignup}>
                        Começar Agora - É Grátis
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </section>

            <footer id="contato" className="bg-foreground text-background py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                                    <Search className="w-5 h-5 text-foreground" />
                                </div>
                                <span className="font-bold text-xl">FreelancerHub</span>
                            </div>
                            <p className="text-background/70">
                                A plataforma que centraliza suas oportunidades de trabalho freelancer.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Produto</h4>
                            <ul className="space-y-2 text-background/70">
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Recursos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Preços
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Suporte</h4>
                            <ul className="space-y-2 text-background/70">
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Central de Ajuda
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Contato
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Status
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-background/70">
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Privacidade
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Termos
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-background transition-colors">
                                        Cookies
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
                        <p>&copy; 2024 FreelancerHub. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
