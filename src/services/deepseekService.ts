import axios from 'axios';

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class DeepSeekService {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    // En un entorno real, esto vendría de variables de entorno
    this.apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY || '';
    this.baseURL = 'https://api.deepseek.com/v1/chat/completions';
  }

  async sendMessage(message: string, agentPrompt?: string): Promise<string> {
    if (!this.apiKey) {
      // Si no hay API key, usar respuestas simuladas
      return this.getSimulatedResponse(message, agentPrompt);
    }

    try {
      const messages: DeepSeekMessage[] = [];
      
      // Agregar el prompt del agente si existe
      if (agentPrompt) {
        messages.push({
          role: 'system',
          content: agentPrompt
        });
      }

      // Agregar el mensaje del usuario
      messages.push({
        role: 'user',
        content: message
      });

      const requestBody: DeepSeekRequest = {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 500
      };

      const response = await axios.post<DeepSeekResponse>(
        this.baseURL,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      // Fallback a respuestas simuladas en caso de error
      return this.getSimulatedResponse(message, agentPrompt);
    }
  }

  private getSimulatedResponse(message: string, agentPrompt?: string): string {
    // Simular un delay realista (comentado para evitar warning)
    // const delay = 1000 + Math.random() * 2000;
    
    // Respuestas simuladas basadas en el tipo de agente
    const responses = {
      chistes: [
        '¿Por qué los libros de matemáticas están tristes? ¡Porque tienen demasiados problemas! 😄',
        '¿Qué le dice un gato a otro gato? ¡Miau! 😸',
        '¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen Twitter! 🐦',
        '¿Qué hace un pez cuando está aburrido? ¡Nada! 🐠',
        '¿Por qué los esqueletos no pelean entre ellos? ¡Porque no tienen agallas! 💀',
        '¿Qué le dice un árbol a otro árbol? ¡Qué tal, tronco! 🌳',
        '¿Por qué los ordenadores van al médico? ¡Porque tienen virus! 💻',
        '¿Qué hace un músico cuando se pierde? ¡Busca la nota! 🎵'
      ],
      social: [
        'Recuerda que cada conversación es una oportunidad de aprendizaje. No te presiones por ser perfecto, solo sé tú mismo. Las personas genuinas son las más atractivas socialmente.',
        'Una buena técnica es hacer preguntas abiertas sobre los intereses de la otra persona. A la mayoría de la gente le encanta hablar sobre lo que les apasiona.',
        'No olvides que el lenguaje corporal es muy importante. Mantén contacto visual, sonríe y adopta una postura abierta. Esto te hará parecer más accesible.',
        'Es normal sentirse nervioso al conocer gente nueva. Respira profundo y recuerda que todos hemos estado en esa situación alguna vez.',
        'Intenta encontrar puntos en común con la otra persona. Los intereses compartidos son excelentes puntos de partida para conversaciones.',
        'No tengas miedo de mostrar vulnerabilidad. Ser auténtico y honesto sobre tus sentimientos puede crear conexiones más profundas.',
        'Practica la escucha activa. Presta atención a lo que dice la otra persona y haz preguntas de seguimiento.',
        'Recuerda que no todas las conversaciones tienen que ser profundas. A veces, las charlas casuales son igual de valiosas.'
      ],
      animo: [
        'Tienes más fortaleza de la que crees. Cada día es una nueva oportunidad para brillar, y tú tienes todo lo necesario para hacerlo.',
        'Los momentos difíciles son temporales, pero tu capacidad de superarlos es permanente. Eres más fuerte de lo que piensas.',
        'Recuerda que está bien no estar bien todo el tiempo. Permítete sentir, pero no te quedes ahí. Tú mereces felicidad y paz.',
        'Cada paso que das, por pequeño que sea, te acerca a donde quieres estar. Celebra tus progresos, por mínimos que parezcan.',
        'Eres único y valioso tal como eres. No necesitas cambiar para ser digno de amor y respeto.',
        'Los errores son parte del aprendizaje. No te castigues por ellos, úsalos como oportunidades para crecer.',
        'Tienes el poder de crear el cambio que deseas en tu vida. Empieza con pequeños pasos y verás cómo todo se transforma.',
        'Recuerda que no estás solo. Hay personas que te quieren y están aquí para apoyarte en los momentos difíciles.'
      ],
      general: [
        '¡Hola! Soy tu asistente personal. Puedes contarme lo que quieras o seleccionar uno de mis agentes especializados para obtener ayuda más específica. ¿En qué puedo ayudarte hoy?',
        'Estoy aquí para escucharte y ayudarte. No dudes en compartir lo que tengas en mente.',
        'Cada día es una nueva oportunidad para aprender y crecer. ¿Qué te gustaría explorar hoy?',
        'Recuerda que es normal tener preguntas y dudas. Estoy aquí para ayudarte a encontrar respuestas.',
        'Tú tienes el poder de crear el día que deseas. ¿Qué te gustaría hacer diferente hoy?'
      ]
    };

    // Determinar qué tipo de respuestas usar basándose en el prompt del agente
    let responseType = 'general';
    if (agentPrompt) {
      if (agentPrompt.includes('chistes')) responseType = 'chistes';
      else if (agentPrompt.includes('social')) responseType = 'social';
      else if (agentPrompt.includes('ánimo') || agentPrompt.includes('animo')) responseType = 'animo';
    }

    const availableResponses = responses[responseType as keyof typeof responses];
    return availableResponses[Math.floor(Math.random() * availableResponses.length)];
  }

  // Método para verificar si la API está disponible
  isApiAvailable(): boolean {
    return !!this.apiKey;
  }
}

const deepSeekService = new DeepSeekService();
export default deepSeekService; 