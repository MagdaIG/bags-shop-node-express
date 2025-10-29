# Estructura de imágenes para Handmade Bags Store

## 📁 Ubicación de las imágenes

Las imágenes deben ir en: `public/img/`

## 🗂️ Estructura recomendada

```
public/
├── img/
│   ├── products/           # Imágenes de productos artesanales
│   │   ├── book-quilted-bag.png
│   │   ├── drawstring-bag.png
│   │   ├── drawstring-minibag.png
│   │   ├── laptop-quilted-bag.png
│   │   ├── makeup-bag-lavender.png
│   │   ├── makeup-quilted.png
│   │   ├── mini-pouch.png
│   │   ├── money-bag.png
│   │   ├── round-bag.png
│   │   ├── scrunchies.png
│   │   └── tote-bag.png
│   ├── hero/              # Imágenes del hero section
│   │   ├── hero-bg.jpg
│   │   └── hero-bags.jpg
│   ├── icons/             # Iconos personalizados
│   │   ├── logo.png
│   │   └── favicon.ico
│   └── avatars/           # Avatares de usuarios (opcional)
│       ├── default-avatar.png
│       └── user-placeholder.jpg
├── css/
│   └── theme.css
└── js/                    # Scripts adicionales (opcional)
    └── custom.js
```

## 🖼️ Cómo usar las imágenes en las vistas

### En las plantillas EJS:

```html
<!-- Imagen de producto artesanal -->
<img src="/img/book-quilted-bag.png" 
     alt="Book Quilted Bag - Hecho a mano" 
     class="img-fluid rounded">

<!-- Imagen del hero -->
<img src="/img/hero/hero-bags.jpg" 
     alt="Colección de Handmade Bags Artesanales" 
     class="img-fluid">

<!-- Logo -->
<img src="/img/icons/logo.png" 
     alt="Handmade Bags Store - Productos Artesanales" 
     height="40">
```

### En el CSS:

```css
.hero-section {
    background-image: url('/img/hero/hero-bg.jpg');
    background-size: cover;
    background-position: center;
}

.product-image {
    background-image: url('/img/products/book-quilted-bag.png');
    background-size: cover;
    background-position: center;
}
```

## 📏 Especificaciones recomendadas

### Productos Artesanales:
- **Resolución**: 800x600px o 1200x900px
- **Formato**: PNG (para mantener transparencia) o JPG
- **Peso**: Máximo 200KB por imagen
- **Aspecto**: 4:3 o 16:9
- **Enfoque**: Destacar la artesanía y detalles únicos

### Hero/Background:
- **Resolución**: 1920x1080px
- **Formato**: JPG
- **Peso**: Máximo 500KB
- **Tema**: Productos handmade en ambiente cálido y artesanal

### Iconos/Logo:
- **Resolución**: 64x64px, 128x128px, 256x256px
- **Formato**: PNG con transparencia
- **Peso**: Máximo 50KB
- **Estilo**: Reflejar la artesanía y autenticidad

## 🎨 Colores sugeridos para las imágenes

Basándome en el tema pastel del proyecto y la naturaleza artesanal:

- **Book Quilted Bag**: Tonos tierra y beige con texturas naturales
- **Drawstring Bag**: Colores naturales y orgánicos
- **Drawstring Minibag**: Tonos suaves y materiales naturales
- **Laptop Quilted Bag**: Colores neutros con detalles artesanales
- **Makeup Bag Lavender**: Tonos lavanda suaves y elegantes
- **Makeup Quilted**: Colores pastel con texturas acolchadas
- **Mini Pouch**: Tonos cálidos y materiales únicos
- **Money Bag**: Colores discretos con detalles de seguridad
- **Round Bag**: Tonos elegantes y formas orgánicas
- **Scrunchies**: Colores vibrantes pero suaves
- **Tote Bag**: Tonos naturales y materiales sostenibles

## 📝 Nota importante

Las imágenes se sirven automáticamente desde la carpeta `public/` gracias a la configuración de Express:

```javascript
app.use(express.static(path.join(__dirname, '../public')));
```

Esto significa que una imagen en `public/img/products/bag.png` será accesible en `http://localhost:3000/img/products/bag.png`.

## ✨ Enfoque Artesanal

Todas las imágenes deben transmitir:
- **Autenticidad**: Productos únicos y hechos a mano
- **Calidad**: Atención al detalle y materiales premium
- **Exclusividad**: Cada pieza es única e irrepetible
- **Tradición**: Técnicas artesanales tradicionales
- **Amor**: Cada producto está hecho con dedicación y cariño