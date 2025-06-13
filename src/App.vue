<template>
  <div id="app">
    <!-- Show Registration Form or Landing Page -->
    <RegistrationForm v-if="showRegistration" @back="showRegistration = false" />
    
    <!-- Landing Page Content -->
    <div v-else>
      <!-- Navigation Header -->
      <nav class="navbar" :class="{ 'scrolled': isScrolled }">
        <div class="nav-container">
          <div class="nav-brand">
            <h2>✨ PiscoProntuários</h2>
          </div>
          <ul class="nav-menu" :class="{ 'active': isMobileMenuOpen }">
            <li><a href="#home" @click="scrollTo('home')">Início</a></li>
            <li><a href="#about" @click="scrollTo('about')">Sobre</a></li>
            <li><a href="#content" @click="scrollTo('content')">Conteúdo</a></li>
            <li><a href="#pricing" @click="scrollTo('pricing')">Planos</a></li>
            <li><a href="#contact" @click="scrollTo('contact')">Contato</a></li>
            <li>
              <Button 
                label="Cadastrar" 
                class="nav-register-btn" 
                size="small"
                @click="showRegistration = true"
              />
            </li>
          </ul>
          <div class="nav-toggle" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero">
        <div class="hero-container">
          <div class="hero-content">
            <h1 class="hero-title">
              Bem-vindo a
              <span class="gradient-text">PiscoProntuários</span>
            </h1>
            <p class="hero-subtitle">
              Prontuário online para psicólogos: organize consultas, registre atendimentos e receba lembretes por e-mail. Simplifique sua rotina e foque no cuidado com seus pacientes. Ideal para psicólogos autônomos. Experimente agora!
            </p>
            <div class="hero-buttons">
              <Button 
                label="Funcionalidades" 
                class="primary-btn" 
                size="large"
                @click="scrollTo('content')"
              />
              <Button 
                label="Criar Conta" 
                class="secondary-btn" 
                size="large" 
                outlined
                @click="showRegistration = true"
              />
            </div>
          </div>
          <div class="hero-image">
            <img :src="imagem" alt="image" class="rounded">
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="about-section">
        <div class="container">
          <div class="section-header">
            <h2>Sobre</h2>
            <p>Conheça um pouco mais sobre nós</p>
          </div>
          <div class="d-flex gap-3 flex-wrap justify-content-center">
            <div class="col-md-8 about-text">
              <h3>PiscoProntuários</h3>
              <p>
                O Psico Prontuários nasceu em 2023 com o propósito de facilitar a rotina de psicólogos, 
                especialmente aqueles que estão no início da carreira e enfrentam desafios financeiros para acessar ferramentas de gestão. 
                Criamos um sistema acessível, simples e funcional, pensado para ajudar no gerenciamento de pacientes e prontuários, sem burocracia ou altos custos. 
                Hoje, mais de 500 psicólogos, desde recém-formados até especialistas, já utilizam nossa plataforma. Seguimos com o compromisso de oferecer qualidade, 
                praticidade e transparência para apoiar o trabalho de quem cuida da saúde mental.
              </p>
              <div class="stats">
                <div class="stat-item">
                  <h4>500+</h4>
                  <p>Psicólogos Satisfeitos</p>
                </div>
                <div class="stat-item">
                  <h4>10000+</h4>
                  <p>Prontuários Cadastrados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Content Section -->
      <section id="content" class="content-section py-5">
        <div class="container">
          <div class="text-center">
            <h2 style="color: #fff !important;">Conteúdo Exclusivo</h2>
            <p style="color: #bdbdbd !important;">Descubra o que você pode encontrar na nossa plataforma</p>
          </div>
          <div class="content-grid mt-3">
            <Card 
              v-for="content in contentTypes" 
              :key="content.id"
              class="content-card"
            >
              <template #header>
                <div class="content-icon">
                  <i :class="content.icon"></i>
                </div>
              </template>
              <template #title>{{ content.title }}</template>
              <template #content>
                <p>{{ content.description }}</p>
              </template>
            </Card>
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section id="pricing" class="pricing-section">
        <div class="container">
          <div class="section-header">
            <h2>Planos de Assinatura</h2>
            <p>Escolha o plano que melhor se adapta a você</p>
          </div>
          <div class="pricing-grid">
            <Card 
              v-for="plan in pricingPlans" 
              :key="plan.id"
              class="pricing-card col-md-4"
              :class="{ 'featured': plan.featured }"
            >
              <template #header>
                <div class="plan-header">
                  <h3 class="mb-0 mt-4">{{ plan.name }}</h3>
                  <div v-if="plan.featured" class="featured-badge">Mais Popular</div>
                </div>
              </template>
              <template #title>
                <div class="plan-price">
                  <span class="currency">R$</span>
                  <span class="amount">{{ plan.price }}</span>
                  <span class="period">/mês</span>
                </div>
              </template>
              <template #content>
                <ul class="plan-features">
                  <li v-for="feature in plan.features" :key="feature">
                    <i class="pi pi-check"></i>
                    {{ feature }}
                  </li>
                </ul>
              </template>
              <template #footer>
                <Button 
                  :label="plan.buttonText" 
                  class="plan-button"
                  :class="{ 'featured-button': plan.featured }"
                  fluid
                  @click="selectPlan(plan)"
                />
              </template>
            </Card>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials-section">
        <div class="container">
          <div class="section-header">
            <h2>O que dizem sobre</h2>
            <p>Depoimentos reais de assinantes satisfeitos</p>
          </div>
          <div class="testimonials-grid">
            <Card 
              v-for="testimonial in testimonials" 
              :key="testimonial.id"
              class="testimonial-card"
            >
              <template #content>
                <div class="testimonial-content">
                  <div class="stars">
                    <i v-for="n in 5" :key="n" class="pi pi-star-fill"></i>
                  </div>
                  <blockquote>{{ testimonial.content }}</blockquote>
                  <div class="testimonial-author">
                    <strong>{{ testimonial.author }}</strong>
                    <span>{{ testimonial.role }}</span>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="contact-section">
        <div class="container">
          <div class="section-header">
            <h2>Vamos Conversar</h2>
            <p>Entre em contato para dúvidas ou propostas especiais</p>
          </div>
          <div class="contact-content">
            <div class="contact-info">
              <div class="contact-item">
                <i class="pi pi-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>psicoprontuarios@gmail.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="pi pi-instagram"></i>
                <div>
                  <h4>Instagram</h4>
                  <p>@psicoprontuarios</p>
                </div>
              </div>
            </div>
            <form class="contact-form" @submit.prevent="submitForm">
              <div class="form-group">
                <InputText 
                  v-model="form.name" 
                  placeholder="Seu nome"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <InputText 
                  v-model="form.email" 
                  type="email"
                  placeholder="Seu email"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <Textarea 
                  v-model="form.message" 
                  placeholder="Sua mensagem"
                  :rows="5"
                  class="form-input"
                />
              </div>
              <Button 
                type="submit"
                label="Enviar Mensagem" 
                class="submit-btn"
                fluid
              />
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3>✨ PsicoProntuários</h3>
              <p>Plataforma exclusiva de qualidade premium</p>
            </div>
            <div class="footer-section">
              <h4>Links Rápidos</h4>
              <ul>
                <li><a href="#home">Início</a></li>
                <li><a href="#about">Sobre</a></li>
                <li><a href="#content">Conteúdo</a></li>
                <li><a href="#pricing">Planos</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Políticas</h4>
              <ul>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Política de Privacidade</a></li>
                <li><a href="#">Política de Reembolso</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Redes Sociais</h4>
              <div class="social-links">
                <span @click="abrirInstagram()">
                  <i class="pi pi-instagram"></i>
                </span>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2025 Lk Software. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <ScrollTop />
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import RegistrationForm from './pages/RegistrationForm.vue'
import imagePath from '../src/assets/image.png';
import ScrollTop from 'primevue/scrolltop';

export default {
  name: 'App',
  components: {
    Button,
    Card,
    InputText,
    Textarea,
    RegistrationForm,
    ScrollTop,
  },
  data() {
    return {
      showRegistration: false,
      isScrolled: false,
      isMobileMenuOpen: false,
      imagem: imagePath,
      form: {
        name: '',
        email: '',
        message: ''
      },
      contentTypes: [
        {
          id: 1,
          title: 'Agenda online',
          description: 'Agendamento de consultas online, fique sempre por detro de suas consultas marcadas, e receba notificações sobre consultas próximas para nunca se esquecer..',
          icon: 'pi pi-calendar'
        },
        {
          id: 2,
          title: 'Controle Financeiro',
          description: 'Organize suas contas a receber. Controle todos os pagamentos de seus clientes. Dashboard com informações sustentáveis para que saiba sempre como está a situação..',
          icon: 'pi pi-wallet'
        },
        {
          id: 3,
          title: 'Controle de Prontuários',
          description: 'Gerencie o prontuário e anotações de seus clientes de uma forma eficiente e segura. Personalize os formulários das sessões de acordo com sua abordagem ou serviço.',
          icon: 'pi pi-folder-open'
        },
        {
          id: 4,
          title: "PDF's Personalizados",
          description: "Export os PDF's dos prontuários de seus pacientes de forma rápida e prática, podendo assim sempre ter o controle de seus atendimentos.",
          icon: 'pi pi-file-pdf'
        },
        {
          id: 5,
          title: 'Notificações Automáticas',
          description: 'Reduza em até 30% as faltas dos pacientes. Enviamos notificações de sessões ou compromissos via e-mail de forma automática.',
          icon: 'pi pi-bell'
        },
        {
          id: 6,
          title: 'Indicações',
          description: 'Indiquem colegas da área a usarem nosso sistema com um link de indicação e receba por isso..',
          icon: 'pi pi-mobile'
        }
      ],
      pricingPlans: [
        // {
        //   id: 1,
        //   name: 'Básico',
        //   price: '29',
        //   features: [
        //     'Acesso a fotos exclusivas',
        //     'Novos conteúdos semanais',
        //     'Suporte por email',
        //     'Qualidade HD'
        //   ],
        //   buttonText: 'Começar Agora',
        //   featured: false
        // },
        {
          id: 2,
          name: 'Premium',
          price: '49',
          features: [
            'Agenda online',
            'Controle Financeiro',
            'Controle de Prontuários',
            'PDF"s Personalizados',
            'Notificações Automáticas'
          ],
          buttonText: '5 dias gratuíto',
          featured: true
        },
        // {
        //   id: 3,
        //   name: 'VIP',
        //   price: '99',
        //   features: [
        //     'Tudo do plano Premium',
        //     'Videochamadas exclusivas',
        //     'Conteúdo sob demanda',
        //     'Acesso prioritário',
        //     'Presentes personalizados'
        //   ],
        //   buttonText: 'Experiência VIP',
        //   featured: false
        // }
      ],
      testimonials: [
        {
          id: 1,
          content: 'Conteúdo de qualidade excepcional! A PsicoProntuários é muito profissional e atenciosa com todos os assinantes e principalmente atende a todas as minhas necessidades!',
          author: 'Karen A.',
          role: 'Assinante Premium'
        },
        {
          id: 2,
          content: 'Comecei a usar o Psico Prontuários logo após me formar e foi a melhor escolha! O sistema é simples, completo e cabe no meu orçamento. Me ajuda muito a organizar meus atendimentos e evoluções clínicas.!',
          author: 'Rafael S.',
          role: 'Assinante Premium'
        },
        {
          id: 3,
          content: 'Já testei outros sistemas, mas nenhum foi tão direto e prático quanto o Psico Prontuários. Além de ser acessível, a plataforma me dá segurança e agilidade no dia a dia do consultório. Super recomendo!',
          author: 'João P.',
          role: 'Assinante Premium'
        }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    scrollTo(elementId) {
      const element = document.getElementById(elementId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
      this.isMobileMenuOpen = false
    },
    selectPlan(plan) {
      this.showRegistration = true
    },
    submitForm() {
      if (this.form.name && this.form.email && this.form.message) {
        alert('Mensagem enviada com sucesso! Retornarei em breve.')
        this.form = { name: '', email: '', message: '' }
      } else {
        alert('Por favor, preencha todos os campos.')
      }
    },
    abrirInstagram() {
      window.open('https://www.instagram.com/psicoprontuarios/')
    }
  }
}
</script>