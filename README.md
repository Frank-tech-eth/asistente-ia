# 🤖 Asistente IA para Introvertidos

Una aplicación web moderna diseñada específicamente para personas introvertidas, con 3 agentes de IA especializados que te ayudan en diferentes aspectos de tu vida diaria.

## ✨ Características

### 🗨️ Chat General
- Conversación libre con la IA sobre cualquier tema
- Respuestas personalizadas y empáticas
- Interfaz intuitiva y fácil de usar

### 😄 Agente de Chistes
- Chistes divertidos y apropiados para alegrar tu día
- Humor positivo y amigable
- Perfecto para momentos de estrés o aburrimiento

### 🤝 Agente Social
- Consejos prácticos para mejorar habilidades sociales
- Técnicas de conversación y acercamiento a personas
- Estrategias para superar la timidez de manera auténtica

### 💪 Agente de Ánimo
- Palabras de aliento cuando te sientes decaído
- Consejos motivacionales y apoyo emocional
- Ayuda para superar momentos difíciles

## 🚀 Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **DeepSeek API** - Modelo de IA avanzado para respuestas inteligentes
- **Axios** - Cliente HTTP para llamadas a la API
- **CSS3** - Estilos modernos con gradientes y efectos visuales

## 📦 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/asistente-ia.git
   cd asistente-ia
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la API de DeepSeek (opcional):**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   REACT_APP_DEEPSEEK_API_KEY=tu_api_key_aqui
   ```

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🔧 Configuración de la API

### Obtener API Key de DeepSeek

1. Ve a [DeepSeek Platform](https://platform.deepseek.com/)
2. Crea una cuenta o inicia sesión
3. Ve a la sección de API Keys
4. Genera una nueva API key
5. Copia la key y agrégala al archivo `.env`

### Sin API Key

Si no configuras la API key, la aplicación funcionará con respuestas simuladas predefinidas. Esto es perfecto para probar la funcionalidad sin necesidad de configuración adicional.

## 🎨 Características de la Interfaz

- **Diseño Responsivo** - Funciona perfectamente en móviles, tablets y computadoras
- **Tema Moderno** - Gradientes atractivos y efectos visuales suaves
- **Navegación Intuitiva** - Fácil selección entre agentes especializados
- **Indicadores Visuales** - Animaciones de escritura y estados de carga
- **Accesibilidad** - Interfaz accesible para todos los usuarios

## 🧠 Cómo Funcionan los Agentes

### Agente de Chistes
- Analiza el contexto de la conversación
- Proporciona chistes apropiados y divertidos
- Mantiene un tono positivo y amigable

### Agente Social
- Ofrece consejos prácticos y realistas
- Se enfoca en técnicas probadas para mejorar habilidades sociales
- Proporciona apoyo sin presionar

### Agente de Ánimo
- Detecta emociones negativas en el mensaje
- Proporciona palabras de aliento personalizadas
- Ofrece perspectivas positivas y motivacionales

## 📱 Uso en Dispositivos Móviles

La aplicación está completamente optimizada para dispositivos móviles:

- **Panel de Agentes** - Se convierte en un carrusel horizontal en pantallas pequeñas
- **Chat Adaptativo** - Los mensajes se ajustan automáticamente al tamaño de pantalla
- **Navegación Táctil** - Botones y elementos optimizados para interacción táctil

## 🔒 Privacidad y Seguridad

- **Sin Almacenamiento** - Los mensajes no se guardan permanentemente
- **API Segura** - Las llamadas a la API se realizan de forma segura
- **Sin Tracking** - No se recopila información personal del usuario

## 🛠️ Desarrollo

### Estructura del Proyecto
```
src/
├── App.tsx              # Componente principal
├── App.css              # Estilos de la aplicación
├── services/
│   └── deepseekService.ts  # Servicio para la API de DeepSeek
└── ...
```

### Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack (irreversible)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **DeepSeek** por proporcionar la API de IA
- **React Team** por el framework increíble
- **Comunidad de desarrolladores** por las herramientas y librerías

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. Revisa la sección de [Issues](https://github.com/tu-usuario/asistente-ia/issues)
2. Crea un nuevo issue si no encuentras la respuesta
3. Contacta al equipo de desarrollo

---

**¡Esperamos que esta aplicación te ayude a sentirte más cómodo y apoyado en tu día a día! 🌟**
