const socket = io();

socket.emit("mensajeConexion", { user: "Francisco", rol: "Admin" });

socket.on("credencialesConexion", (info) => {
    console.log(info);
});