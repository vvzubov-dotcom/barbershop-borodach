module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, master, service, date, time } = req.body;

  if (!name || !phone || !master || !service || !date || !time) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const VK_TOKEN = process.env.VK_TOKEN;
  const VK_ADMIN_ID = process.env.VK_ADMIN_ID;

  if (!VK_TOKEN || !VK_ADMIN_ID) {
    return res.status(500).json({ error: 'VK not configured' });
  }

  const message = [
    '\u2705 Новая запись \u2014 \u00ab\u0411\u043e\u0440\u043e\u0434\u0430\u0447\u042a\u00bb',
    '',
    '\u0418\u043c\u044f: ' + name,
    '\u0422\u0435\u043b\u0435\u0444\u043e\u043d: ' + phone,
    '\u041c\u0430\u0441\u0442\u0435\u0440: ' + master,
    '\u0423\u0441\u043b\u0443\u0433\u0430: ' + service,
    '\u0414\u0430\u0442\u0430: ' + date,
    '\u0412\u0440\u0435\u043c\u044f: ' + time
  ].join('\n');

  try {
    var params = new URLSearchParams({
      access_token: VK_TOKEN,
      user_id: VK_ADMIN_ID,
      random_id: String(Math.floor(Math.random() * 2147483647)),
      message: message,
      v: '5.199'
    });

    var response = await fetch('https://api.vk.com/method/messages.send?' + params.toString());
    var data = await response.json();

    if (data.error) {
      console.error('VK API error:', JSON.stringify(data.error));
      return res.status(500).json({ error: 'VK API error: ' + (data.error.error_msg || 'unknown') });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};
