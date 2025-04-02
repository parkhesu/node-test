const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redisAdapter = require('socket.io-redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // 모든 출처에서의 요청 허용
    methods: ['GET', 'POST']
  }
});

// Redis 어댑터 연결 (선택 사항)
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 3000 포트에서 메시지 처리
io.of('/3000').on('connection', (socket) => {
  console.log('새로운 클라이언트 연결됨 (3000포트)');

  socket.on('chat message', (data) => {
    console.log('받은 메시지 (3000포트):', data.message);
    // 3000 포트에 연결된 모든 클라이언트에게 메시지 전송
    io.of('/3000').emit('chat message', data);
    // 3001 포트로 메시지 전달
    io.of('/3001').emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 종료 (3000포트)');
  });
});

// 3001 포트에서 메시지 처리
io.of('/3001').on('connection', (socket) => {
  console.log('새로운 클라이언트 연결됨 (3001포트)');

  socket.on('chat message', (data) => {
    console.log('받은 메시지 (3001포트):', data.message);
    // 3001 포트에 연결된 모든 클라이언트에게 메시지 전송
    io.of('/3001').emit('chat message', data);
    // 3000 포트로 메시지 전달
    io.of('/3000').emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 종료 (3001포트)');
  });
});

server.listen(3000, () => {
  console.log('서버가 http://localhost:3000 에서 실행 중입니다');
});

server.listen(3001, () => {
  console.log('서버가 http://localhost:3001 에서 실행 중입니다');
});
print('h1');