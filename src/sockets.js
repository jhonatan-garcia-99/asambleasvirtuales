module.exports = function(io) {

    let users = {}

    io.on('connection', socket => {
        console.log('new user connected');

        socket.on('canal', function(data, cb) {

            socket.nickname = data
            users[socket.nickname] = socket;
            UpdateNicknames();

        });


        socket.on('send message', (data, cb) => {
            io.sockets.emit('new message', {
                msg: data.msg,
                nick: socket.nickname
            });

        });
        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            UpdateNicknames();
        });

        function UpdateNicknames() {
            io.sockets.emit('nicknames', Object.keys(users));
        }
    });


    /*
           io.sockets.emit('new message', {
               msg: data.msg,
               nick: socket.nickname
           });
           */


}