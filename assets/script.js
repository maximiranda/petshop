const URL = "https://apipetshop.herokuapp.com/api/articulos"

const { createApp } = Vue

createApp({
    data() {
        return {
            nombre: "",
            email: "",
            mensaje: "",
            telefono: "",
            nombreMascota: "",

            productos : [],
            inputBusqueda: '',
            auxProductos : [],
            productoCarrId : [],
            productosCarrito: [],
            carritoStorage : [],
            productoFavId : [],
            favStorage : [],
            productosFav : [],
            sumaTotal : 0,
            moneyFormat : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }),
        }
    },
    created() {
        fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                if (document.title == "Juguetes"){
                    this.productos = data.response.filter(producto => producto.tipo == "Juguete")
                }
                if (document.title == "Farmacia"){
                    this.productos = data.response.filter(producto => producto.tipo == "Medicamento")
                }
                if (document.title == "Franco PetShop"){
                    this.productos = data.response
                }
                this.auxProductos = this.productos.sort(function(a,b){
                    if (a.nombre < b.nombre){
                        return -1
                    }
                    if (a.nombre > b.nombre){
                        return 1
                    }
                    return 0
        
                })
                
                if(JSON.parse(localStorage.getItem("carrito"))){
                    this.carritoStorage = JSON.parse(localStorage.getItem("carrito"))
                    
                }
                this.productosCarrito = this.carritoStorage
                if (JSON.parse(localStorage.getItem("fav"))){
                    this.favStorage = JSON.parse(localStorage.getItem("fav"))
                }
                this.productosFav = this.favStorage
            })
            .catch((error) => console.log(error))
    },
mounted() {},
methods: {
     async inicioDeUsuario(){
        const { value: formValues } = await Swal.fire({
            title: 'Iniciar Sesion:',
            html:
              '<input id="swal-input1" class="swal2-input" placeHolder="Usuario">' +
              '<input id="swal-input2" class="swal2-input" type="password" placeHolder="Contraseña">'+
              '<p>Si no tiene cuenta. <a class="link" href="#">Registrarse</a></p>',
            showConfirmButton: true,
            confirmButtonText: "Ingresar",
            preConfirm: () => {
              return 'Bienvenido!'
            }
          })
          
          if (formValues) {
            Swal.fire(JSON.stringify(formValues))
          }
     },
    alertaConfirmarCompra(){
        Swal.fire({
            title: '¿Confirmar compra?',
            text: "No podra revertirse",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, confirmar compra!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Hecho!',
                `Tu compra se ha realizado con exito!.<p class="fw-bold">${this.moneyFormat.format(this.sumaTotal)}</p>`,
                'success'
              )
              this.vaciarCarr()
            }
          })
        
    },
    alertaProducto(string,ico){
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          })
          
          Toast.fire({
            icon: ico,
            title: string,
          })
    },
    alertaVaciarCarrito(){
        Swal.fire({
            title: '¿Estas Seguro?',
            text: "No podras revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si!, borrarlo'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Borrado!',
                'El carrito ha sido borrado.',
                'Hecho'
              )
              this.vaciarCarr()
            }
          })
    },
    filtrarPorBusqueda(){
        console.log(this.inputBusqueda)
        if (inputBusqueda =! ""){
            if(document.title == "Franco PetShop"){
                let coincidencia = this.auxProductos.find(produc => produc.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()) || produc.descripcion.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
                if (coincidencia.tipo == "Medicamento"){
                    window.location.replace("./farmacia.html")
                    this.productos = this.auxProductos.filter(producto => producto.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()) || producto.descripcion.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
                }else {
                    window.location.replace("./juguetes.html")
                    this.productos = this.auxProductos.filter(producto => producto.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()) || producto.descripcion.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
                }
            } else {
                this.productos = this.auxProductos.filter(producto => producto.nombre.toLowerCase().includes(this.inputBusqueda.toLowerCase()) || producto.descripcion.toLowerCase().includes(this.inputBusqueda.toLowerCase()))
            }
        } else {
            this.productos = this.auxProductos
        }
    },
    enter(evento){
        if (evento.key == "Enter"){
            evento.preventDefault()
            this.filtrarPorBusqueda()
        }
    },
    mensajeDeAviso(){
        if (this.nombre.length== 0 || this.email.length== 0 || this.mensaje.length== 0 || this.telefono.length== 0 || this.nombreMascota.length== 0){ 
            Swal.fire(
                'Error',
                'Debes completar todas las casillas para enviar el mensaje',
                'error'
            )
        } else{
            Swal.fire(
                'Enviado',
                'Su mensaje ha sido enviado exitosamente',
                'success'
            )
        }
    },
    ordenarPorNombreAsc(){
        let productoOrdenado = this.productos.sort(function(a,b){
            if (a.nombre < b.nombre){
                return 1
            }
            if (a.nombre > b.nombre){
                return -1
            }
            return 0

        })
        this.productos = productoOrdenado
    },
    ordenarPorNombreDesc(){
        let productoOrdenado = this.productos.sort(function(a,b){
            if (a.nombre < b.nombre){
                return -1
            }
            if (a.nombre > b.nombre){
                return 1
            }
            return 0

        })
        this.productos = productoOrdenado
    },
    ordenarPorPrecioAsc(){
        this.productos = this.productos.sort((a,b) => {
            if (a.precio > b.precio){
                return 1
            }
            if (a.precio < b.precio){
                return -1
            }
            return 0
        })

    },
    ordenarPorPrecioDesc(){
        this.productos = this.productos.sort((a,b) => {
            if (a.precio > b.precio){
                return -1
            }
            if (a.precio < b.precio){
                return 1
            }
            return 0
        })

    },
    agregarItemCarr(producto){
        this.productoCarrId= this.productosCarrito.map(producto=> producto._id)

        if (!this.productoCarrId.includes(producto._id)){
            producto.cantidad = 1
            this.productosCarrito.push(producto)
            this.productoCarrId= this.productosCarrito.map(producto=> producto._id)
            localStorage.setItem("carrito", JSON.stringify(this.productosCarrito))
            this.alertaProducto("Producto añadido al carrito", "success")

            }
        else{
            this.eliminarItemCarr(producto)
            this.alertaProducto("Producto eliminado del carrito", "error")

        }
        
    },
    eliminarItemCarr(producto){
        this.carritoStorage = this.productosCarrito.filter(produc => produc._id != producto._id)
        this.productosCarrito = this.carritoStorage
        this.productoCarrId= this.productosCarrito.map(producto=> producto._id)
        producto.cantidad = 0
        localStorage.setItem("carrito", JSON.stringify(this.productosCarrito))
    },
    vaciarCarr(){
        this.productosCarrito = []
        localStorage.removeItem("carrito")
    },
    restar(producto, e){
        let actual = producto.cantidad--
        if (actual == 1){
            e.target.disable = true
            producto.cantidad = 1
        } 
        this.actualizarCantidad(producto)
    },
    sumar(producto){
        let actual = producto.cantidad++
        if (actual == producto.stock){
            producto.cantidad = producto.stock
        }
        this.actualizarCantidad(producto)
    },
    calculoTotal(){
        let suma = 0
        if(this.productosCarrito){
            this.productosCarrito.forEach(producto => {
                suma += producto.precio * producto.cantidad
            })
        }

        this.sumaTotal = suma
    },
    actualizarCantidad(producto){
        this.productosCarrito.map(product => {
            if (producto._id == product._id){
                product.cantidad = producto.cantidad
            }
        })
        localStorage.setItem("carrito", JSON.stringify(this.productosCarrito))
    },
    estaEnFav(producto){
        return this.productosFav.some(({_id}) => _id == producto._id)
    },

    agregarFav(producto){
        
        this.productoFavId= this.productosFav.map(producto=> producto._id)
        if (!this.productoFavId.includes(producto._id)){
            this.productosFav.push(producto)
            localStorage.setItem("fav", JSON.stringify(this.productosFav))
            this.alertaProducto("Añadido a favoritos", "success")
        }
        else {
            this.eliminarItemFav(producto)
            this.alertaProducto("Eliminado de favoritos", "error")
        }
    },
    eliminarItemFav(producto){
        this.favStorage = this.productosFav.filter(produc => produc._id != producto._id)
        this.productosFav= this.favStorage
            localStorage.setItem("fav", JSON.stringify(this.productoFav))
    },
},
computed:{
},
update:{
}
}).mount('#app')

