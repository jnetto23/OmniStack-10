const socketio = require("socket.io");
const haversine = require("haversine");
const parseStringAsArray = require("./utils/parseStringAsArray");

let io;
const connections = [];

exports.setupWebSocket = server => {
  io = socketio(server);

  io.on("connection", socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: parseStringAsArray(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return (
      haversine(coordinates, connection.coordinates) < 10 &&
      connection.techs.some(item => techs.includes(item))
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
