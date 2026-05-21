const http = require('http');

let data = {
  tasks: [
    { id: 1, name: 'Fertilization – "Abono"', sector: 'Sector B', plot: 'Plot 4', cabo: 'Gabe', date: '2026-05-16', time: '7:00 AM', target: '12 Bags Urea / 2.0 Ha', status: 'pending' },
    { id: 2, name: 'Weeding – "Hilamon"', sector: 'Sector A', plot: 'Plot 7', cabo: 'Jun', date: '2026-05-16', time: '9:30 AM', target: '2.5 Ha', status: 'in-progress' },
    { id: 3, name: 'Harvesting – "Pitas"', sector: 'Sector C', plot: 'Plot 2', cabo: 'Mark', date: '2026-05-16', time: '1:00 PM', target: '1.8 Ha', status: 'pending' },
    { id: 4, name: 'Spraying – "Pang-abono"', sector: 'Sector B', plot: 'Plot 1', cabo: 'Ed', date: '2026-05-16', time: '3:30 PM', target: '15 L Solution / 2.0 Ha', status: 'pending' },
    { id: 5, name: 'Cultivation – "Asada"', sector: 'Sector A', plot: 'Plot 3', cabo: 'Rex', date: '2026-05-15', time: '6:00 AM', target: '3.0 Ha', status: 'completed' },
  ],
  prices: [
    { date: 'May 16, 2026', mill: 'SRA Raw Sugar', price: 2800, change: 50, source: 'Facebook Broadcast' },
    { date: 'May 09, 2026', mill: 'SRA Raw Sugar', price: 2750, change: 100, source: 'Facebook Broadcast' },
    { date: 'May 02, 2026', mill: 'SRA Raw Sugar', price: 2650, change: -25, source: 'Manual Entry' },
    { date: 'Apr 25, 2026', mill: 'SRA Raw Sugar', price: 2675, change: 75, source: 'Facebook Broadcast' },
  ],
  syncLogs: [
    { time: '12:45 AM', device: 'iPhone 12 – Gabe', user: 'Gabe', action: 'Price Cache Updated', status: 'synced' },
    { time: '12:12 AM', device: 'Android – Jun', user: 'Jun', action: 'Task Logged: Weeding Plot 7', status: 'synced' },
    { time: '11:58 PM', device: 'Android – Mark', user: 'Mark', action: 'Task Logged: Harvesting Plot 2', status: 'pending' },
    { time: '11:30 PM', device: 'iPhone 12 – Gabe', user: 'Gabe', action: 'Task Completed: Fertilization Plot 4', status: 'synced' },
  ]
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Parse path
  const url = req.url.split('?')[0];

  if (url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  if (url === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        if (payload.tasks && Array.isArray(payload.tasks)) {
          payload.tasks.forEach(t => {
            const existing = data.tasks.find(x => x.id === t.id);
            if (existing) {
              Object.assign(existing, t);
            } else {
              data.tasks.push(t);
            }
          });
        }
        if (payload.syncLogs && Array.isArray(payload.syncLogs)) {
          payload.syncLogs.forEach(l => {
            data.syncLogs.unshift(l);
          });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (url === '/api/price' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const p = JSON.parse(body);
        data.prices.unshift(p);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (url === '/api/task' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const t = JSON.parse(body);
        data.tasks.push(t);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HUGPONG Mock Sync Server running on http://localhost:${PORT}`);
});
