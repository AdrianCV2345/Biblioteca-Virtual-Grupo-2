export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Acerca de Biblioteca Virtual
      </h1>
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-gray-700 mb-6">
          Biblioteca Virtual es una aplicación web que te permite explorar y
          descubrir libros utilizando la API de Open Library. Puedes buscar libros
          por título, autor o tema, ver detalles completos de cada libro y
          guardar tus favoritos para acceder a ellos fácilmente.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Características</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Búsqueda de libros en tiempo real</li>
          <li>Visualización de portadas y detalles completos</li>
          <li>Sistema de favoritos con almacenamiento local</li>
          <li>Interfaz responsive y moderna</li>
          <li>Navegación intuitiva</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">Tecnologías utilizadas</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>React con TypeScript</li>
          <li>React Router para navegación</li>
          <li>Tailwind CSS para estilos</li>
          <li>API de Open Library</li>
          <li>LocalStorage para persistencia</li>
        </ul>
      </div>
    </div>
  );
}
