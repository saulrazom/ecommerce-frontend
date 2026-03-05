import axios from 'axios'

// 1. Creamos la instancia base
const api = axios.create({
  // Vite usa import.meta.env para leer variables de entorno
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Interceptor de Respuestas (El "Manejador de Errores" que pide el profe)
api.interceptors.response.use(
  (response) => {
    // Si la petición es exitosa (ej. 200 OK), simplemente pasamos los datos
    return response
  },
  (error) => {
    // Si el backend falla, este bloque atrapa el error antes de que rompa la app
    console.error('Error global en la API:', error)

    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status
      if (status === 404) {
        alert('Ups... El recurso que buscas no existe (404).')
      } else if (status >= 500) {
        alert('Error en el servidor de backend. Los de DevOps ya están sudando (500).')
      }
    } else if (error.request) {
      // La petición salió, pero no hubo respuesta (backend caído o sin internet)
      alert(
        'Error de red. Revisa tu conexión a internet o verifica si el API Gateway está encendido.',
      )
    }

    // Rechazamos la promesa para que el componente que hizo la llamada sepa que falló
    return Promise.reject(error)
  },
)

export default api
